"""Public prediction-market research radar. Python standard library only; no keys."""
import argparse
import copy
import concurrent.futures
import datetime as dt
import html
import json
import math
from pathlib import Path
import re
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
UTC = dt.timezone.utc
CST = dt.timezone(dt.timedelta(hours=8))
DAY = 86400

def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    temp.replace(path)

def num(value):
    try:
        n = float(value)
        return n if math.isfinite(n) else None
    except (ValueError, TypeError):
        return None

def array(value):
    return json.loads(value) if isinstance(value, str) else (value or [])

def stamp(value):
    try:
        return dt.datetime.fromisoformat(value.replace('Z', '+00:00')).timestamp()
    except (ValueError, TypeError, AttributeError):
        return None

class Client:
    def __init__(self, config, raw):
        self.config, self.raw, self.serial = config, raw, 0

    def get(self, base, **params):
        url = base + ('?' + urllib.parse.urlencode(params) if params else '')
        for attempt in range(self.config['retries']):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'ResearchRadar/0.1', 'Accept': 'application/json'})
                with urllib.request.urlopen(req, timeout=self.config['request_timeout']) as r:
                    result = json.load(r)
                self.serial += 1
                dump(self.raw / f'{self.serial:05}.json', {'url': url, 'fetched_at': time.time(), 'data': result})
                time.sleep(0.12)
                return result
            except Exception:
                if attempt + 1 == self.config['retries']:
                    raise
                time.sleep(1 + attempt)

def classify(title, category, config):
    if re.search(config['exclude_pattern'], title, re.I) or (category or '').lower() in ('sports', 'entertainment'):
        return None
    return next((t for t in config['topics'] if re.search(t['pattern'], title, re.I)), None)

def normalize(platform, event, config, now):
    title = event.get('title', '')
    topic = classify(title, event.get('category', ''), config)
    eid = str(event.get('id') if platform == 'Polymarket' else event.get('event_ticker'))
    key = platform + ':' + eid
    manual = key in config['manual_event_ids']
    if not topic and not manual:
        return None
    topic = topic or {'name': '手动关注', 'fixed': False, 'question': '核对事件原始材料和最新进展。'}
    rows = []
    for m in event.get('markets', []):
        if platform == 'Polymarket':
            if m.get('closed') or not m.get('active', True):
                continue
            labels, prices, tokens = array(m.get('outcomes')), array(m.get('outcomePrices')), array(m.get('clobTokenIds'))
            # Preserve the outcome mapping; do not assume Yes is always first.
            index = next((i for i, s in enumerate(labels) if s.lower() == 'yes'), 0)
            p = num(prices[index]) if len(prices) > index else None
            bid, ask = num(m.get('bestBid')), num(m.get('bestAsk'))
            rows.append({'id': str(m['id']), 'label': m.get('question', title) + ' [' + (labels[index] if labels else '?') + ']',
                         'p': p, 'basis': '平台 outcomePrices', 'token': tokens[index] if len(tokens) > index else None,
                         'volume': num(m.get('volume24hr')) or 0, 'bid': bid, 'ask': ask,
                         'end': m.get('endDate'), 'history': [], 'spread_basis_valid': index == 0})
        else:
            if m.get('status') not in ('open', 'active'):
                continue
            bid, ask = num(m.get('yes_bid_dollars')), num(m.get('yes_ask_dollars'))
            # Use a comparable midpoint time series. Missing quotes are not zero.
            valid = bid is not None and ask is not None and 0 <= bid <= ask <= 1
            rows.append({'id': m['ticker'], 'label': m.get('yes_sub_title') or m.get('title', title),
                         'p': (bid + ask) / 2 if valid else None, 'basis': 'YES 买卖报价中点',
                         'volume': num(m.get('volume_24h_fp')) or 0, 'bid': bid, 'ask': ask,
                         'end': m.get('expected_expiration_time') or m.get('close_time'), 'history': [], 'spread_basis_valid': True})
    if not rows:
        return None
    end = min((stamp(m['end']) for m in rows if stamp(m['end']) is not None), default=None)
    return {'key': key, 'platform': platform, 'id': eid, 'title': title, 'topic': topic['name'],
            'fixed': topic['fixed'], 'manual': manual, 'question': topic['question'], 'end': end,
            'series': event.get('series_ticker'),
            'url': 'https://polymarket.com/event/' + event.get('slug', '') if platform == 'Polymarket' else
                   'https://external-api.kalshi.com/trade-api/v2/events/' + urllib.parse.quote(eid),
            'volume': sum(m['volume'] for m in rows), 'markets': rows, 'captured_at': now}

def collect(platform, config, raw, now):
    client = Client(config, raw / platform)
    records, seen = [], set()
    cursor = ''
    count = 0
    try:
        for page in range(config['max_pages']):
            if platform == 'Polymarket':
                params = {'closed': 'false', 'limit': 200}
                if cursor:
                    params['after_cursor'] = cursor
                data = client.get('https://gamma-api.polymarket.com/events/keyset', **params)
                items = data['events']
            else:
                data = client.get('https://external-api.kalshi.com/trade-api/v2/events', status='open', with_nested_markets='true', limit=200, cursor=cursor)
                items = data['events']
            count += len(items)
            if page % 10 == 0:
                print(f'{platform}: scanned {count} events', flush=True)
            for item in items:
                e = normalize(platform, item, config, now)
                if e and e['key'] not in seen:
                    seen.add(e['key'])
                    records.append(e)
            nxt = data.get('next_cursor' if platform == 'Polymarket' else 'cursor', '')
            if not nxt:
                return records, {'status': 'ok', 'scanned_events': count}
            if nxt == cursor:
                raise ValueError('Repeated pagination cursor')
            cursor = nxt
        return records, {'status': 'partial', 'scanned_events': count, 'error': '达到分页上限，覆盖不完整'}
    except Exception as e:
        return records, {'status': 'partial' if count else 'failed', 'scanned_events': count, 'error': str(e)}

def enrich_history(events, config, raw, now):
    # Allocate by platform and prioritize nearby fixed events, then meaningful volume.
    rows = []
    for platform in ('Polymarket', 'Kalshi'):
        subset = [e for e in events if e['platform'] == platform]
        selected = sorted(subset, key=lambda e: (not e['manual'], not (e['fixed'] and e['end'] and 0 <= e['end']-now <= 45*DAY),
                                                 -e['volume']))
        # Round robin events so a market with many strike buckets cannot consume all history slots.
        queues = [[(e, m) for m in sorted(e['markets'], key=lambda m: -m['volume'])] for e in selected[:20]]
        budget = config['history_market_limit']//2
        for i in range(max((len(q) for q in queues), default=0)):
            for q in queues:
                if budget and i < len(q):
                    rows.append(q[i]); budget -= 1
    clients = {p: Client(config, raw / (p + '-history')) for p in ('Kalshi', 'Polymarket')}
    failures = {'Polymarket': 0, 'Kalshi': 0}
    for e, m in rows:
        if failures[e['platform']] >= 3:
            m['history_error'] = '历史接口连续失败，停止本轮补取；仍保留每日快照'
            continue
        c = clients[e['platform']]
        try:
            if e['platform'] == 'Polymarket':
                if not m.get('token'):
                    continue
                data = c.get('https://clob.polymarket.com/prices-history', market=m['token'], startTs=int(now-15*DAY), endTs=int(now), fidelity=60)
                m['history'] = [{'t': x['t'], 'p': num(x['p']), 'source': 'CLOB 历史价格'} for x in data['history'] if num(x.get('p')) is not None]
            else:
                data = c.get('https://external-api.kalshi.com/trade-api/v2/markets/candlesticks', market_tickers=m['id'], start_ts=int(now-15*DAY), end_ts=int(now), period_interval=60)
                history = []
                for group in data['markets']:
                    for x in group.get('candlesticks', []):
                        b, a = num(x.get('yes_bid', {}).get('close_dollars')), num(x.get('yes_ask', {}).get('close_dollars'))
                        if b is not None and a is not None and 0 <= b <= a <= 1:
                            history.append({'t': x['end_period_ts'], 'p': (a+b)/2, 'source': '小时收盘报价中点'})
                m['history'] = history
        except Exception as exc:
            m['history_error'] = str(exc)
            failures[e['platform']] += 1
        else:
            failures[e['platform']] = 0

def prior(history, target, tolerance=6*3600):
    # Only observations at/before target, never use a later price as the baseline.
    eligible = [x for x in history if x.get('p') is not None and 0 <= x['p'] <= 1 and 0 <= target-x['t'] <= tolerance]
    return max(eligible, key=lambda x: x['t']) if eligible else None

def analyze(events, snapshots, config, now, state):
    old = {}
    for s in snapshots:
        for e in s.get('events', []):
            old.setdefault(e['key'], []).append(e)
    for e in events:
        previous = old.get(e['key'], [])
        for m in e['markets']:
            history = list(m['history'])
            for before in previous:
                match = next((x for x in before['markets'] if x['id'] == m['id']), None)
                if match and match['basis'] == m['basis'] and match['p'] is not None:
                    history.append({'t': before['captured_at'], 'p': match['p'], 'source': '每日快照'})
            m['history'] = sorted(history, key=lambda x: x['t'])
            m['changes'] = {}
            for d in (1, 7, 14):
                base = prior(history, now-d*DAY)
                m['changes'][str(d)] = {'baseline': base, 'pp': round((m['p']-base['p'])*100, 2) if base and m['p'] is not None else None}
            b, a = m['bid'], m['ask']
            m['quality'] = (m['p'] is not None and b is not None and a is not None and
                            0 <= b <= a <= 1 and a-b <= config['max_spread'] and
                            m['volume'] >= config['min_volume_24h'][e['platform']])
        # Require seven distinct daily observations, excluding today; no fabricated baseline.
        daily = {}
        today = dt.datetime.fromtimestamp(now, CST).date()
        for before in previous:
            date = dt.datetime.fromtimestamp(before['captured_at'], CST).date()
            if 1 <= (today-date).days <= 7:
                daily[date] = before['volume']
        avg = sum(daily.values())/7 if len(daily) == 7 else None
        e['volume_multiple'] = e['volume']/avg if avg and avg > 0 else None
        moves = [(d, m['changes'][str(d)]['pp']) for m in e['markets'] if m['quality'] for d in (7, 14)]
        significant = [(d, v) for d, v in moves if v is not None and abs(v) >= config[f'change_{d}d_pp']]
        reasons = []
        if e['manual']: reasons.append('手动指定，每日跟踪')
        if e['fixed']: reasons.append('固定重点类别，每日跟踪')
        if significant: reasons.append(' / '.join(f'{d}日变化 {v:+.1f} 个百分点' for d, v in significant[:3]))
        quality = any(m['quality'] for m in e['markets'])
        if quality and e['volume_multiple'] and e['volume_multiple'] >= config['volume_multiple']:
            reasons.append(f"24h 活跃度为前7日日均的 {e['volume_multiple']:.1f} 倍")
        triggered = bool(significant) or (quality and e['volume_multiple'] is not None and e['volume_multiple'] >= config['volume_multiple'])
        entry = state.setdefault(e['key'], {'first_seen': now, 'last_signal': None})
        entry.update({'last_seen': now, 'title': e['title'], 'platform': e['platform'], 'url': e['url'], 'fixed': e['fixed'], 'manual': e['manual']})
        if triggered: entry['last_signal'] = now
        retained = entry.get('last_signal') is not None and now-entry['last_signal'] <= config['watch_days']*DAY
        e['watch'] = e['manual'] or e['fixed'] or triggered or retained
        e['reasons'] = reasons or (['自动关注保留期'] if retained else ['相关主题，待研究筛选'])
        e['signal'] = triggered
        e['eligible_research'] = quality
        e['score'] = max((abs(v) for _, v in moves if v is not None), default=0)
        e['state'] = dict(entry)
    # Normalize activity within each platform; never add platform volumes.
    for platform in ('Polymarket', 'Kalshi'):
        ranked = sorted([e for e in events if e['platform'] == platform], key=lambda e: e['volume'])
        for i, e in enumerate(ranked):
            e['activity_percentile'] = (i+1)/len(ranked)*100
            e['score'] += e['activity_percentile']/10
    return events

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=ROOT)
    ap.add_argument('--site', type=Path, default=ROOT/'site')
    args = ap.parse_args()
    root = args.root
    config = json.loads((ROOT/'config.json').read_text(encoding='utf-8'))
    now = time.time()
    run_id = dt.datetime.fromtimestamp(now, UTC).strftime('%Y%m%dT%H%M%S%fZ')
    raw = root/'data'/'raw'/run_id
    events, sources = [], {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        jobs = {p: pool.submit(collect, p, config, raw, now) for p in ('Polymarket', 'Kalshi')}
        for p, job in jobs.items():
            rows, sources[p] = job.result()
            events.extend(rows)
    enrich_history(events, config, raw, now)
    snapshots = []
    for path in sorted((root/'data'/'snapshots').glob('*.json'))[-100:]:
        snapshots.append(json.loads(path.read_text(encoding='utf-8')))
    state_path = root/'data'/'watch-state.json'
    state = json.loads(state_path.read_text(encoding='utf-8')) if state_path.exists() else {}
    analyze(events, snapshots, config, now, state)
    run = {'schema_version': 1, 'captured_at': now, 'sources': sources, 'events': events}
    from report import build_report
    build_report(run, config, root, args.site, state)
    # Persist daily observations without recursively copying historical series.
    compact = copy.deepcopy(run)
    for e in compact['events']:
        e.pop('state', None)
        for m in e['markets']:
            m.pop('history', None)
            m.pop('changes', None)
    day = dt.datetime.fromtimestamp(now, CST).strftime('%Y-%m-%d')
    snapshot_path = root/'data'/'snapshots'/(day+'.json')
    # A retry that fails must not erase successful observations from earlier today.
    if snapshot_path.exists():
        earlier = json.loads(snapshot_path.read_text(encoding='utf-8'))
        got = {e['key'] for e in compact['events']}
        compact['events'].extend(e for e in earlier.get('events', []) if e['key'] not in got)
    dump(snapshot_path, compact)
    for path in (root/'data'/'snapshots').glob('*.json'):
        if path.name[:10] < (dt.datetime.fromtimestamp(now, CST)-dt.timedelta(days=45)).strftime('%Y-%m-%d'):
            path.unlink()
    dump(root/'data'/'latest.json', run)
    dump(state_path, state)
    report = args.site/'index.html'
    print(json.dumps({'sources': sources, 'relevant_events': len(events), 'report': str(report)}, ensure_ascii=False))
    return 0 if all(s['status'] == 'ok' for s in sources.values()) else 2

if __name__ == '__main__':
    raise SystemExit(main())
