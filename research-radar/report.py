"""Deterministic, complete Chinese daily report; no LLM or news dependency."""
import datetime as dt
import html
import json
from pathlib import Path
import re
from model_hook import enrich

DAY = 86400
CST = dt.timezone(dt.timedelta(hours=8))
COLORS = ['#136e62', '#4c63cc', '#ce7620', '#a3448a', '#527c9b']

def esc(x):
    return html.escape(str(x))

def date(ts):
    return dt.datetime.fromtimestamp(ts, CST).strftime('%Y-%m-%d')

def clock(ts):
    return dt.datetime.fromtimestamp(ts, CST).strftime('%m-%d %H:%M')

def probability(p):
    return '—' if p is None else f'{p*100:.1f}%'

def change(m, days):
    return m.get('changes', {}).get(str(days), {}).get('pp')

def strongest(e):
    choices = [(abs(change(m,d)), m, d, change(m,d)) for m in e['markets'] if m.get('quality') for d in (7,14,1) if change(m,d) is not None]
    if choices:
        _, m, d, v = max(choices, key=lambda x:(x[0],x[1]['p'] or 0))
        return m, d, v
    return max(e['markets'], key=lambda m:m['volume']), None, None

def facts(e):
    m, d, v = strongest(e)
    p = probability(m['p'])
    if d is not None:
        trend = f'{d}日上升' if v >= 0 else f'{d}日下降'
        return f"{m['label']}：当前 {p}，{trend} {abs(v):.1f} 个百分点。"
    return f"{m['label']}：当前 {p}；尚无足够的可比历史，今日建立观察基线。"

def family(e):
    # Conservative same-series dedup within a platform; cross-platform rules stay explicit.
    if e.get('series'):
        return e['platform']+':'+e['series']
    if e['fixed']:
        return e['platform']+':'+e['topic']
    return e['platform']+':'+re.sub(r'\b(20\d\d|january|february|march|april|may|june|july|august|september|october|november|december)\b|\d+', '', e['title'].lower())

def pick(events, previous, now, limit=5):
    eligible = []
    for e in events:
        if not e.get('eligible_research'):
            continue
        if not any(m.get('quality') and m['p'] is not None and .005 < m['p'] < .995 for m in e['markets']):
            continue
        past = [p for p in previous if p['key'] == e['key'] and 0 < now-p['t'] < 7*DAY]
        # Repeated topic needs a fresh >=3pp move from its last featured snapshot.
        if past:
            last = max(past,key=lambda p:p['t'])
            moved = any(m['p'] is not None and last.get('prices',{}).get(m['id']) is not None and
                        abs(m['p']-last['prices'][m['id']]) >= .03 for m in e['markets'] if m.get('quality'))
            if not moved:
                continue
        eligible.append(e)
    ranked = sorted(eligible, key=lambda e: (not e['signal'], -e['score']))
    chosen, families, topic_counts = [], set(), {}
    for e in ranked:
        f = family(e)
        if f in families or topic_counts.get(e['topic'],0) >= 2:
            continue
        chosen.append(e); families.add(f)
        topic_counts[e['topic']] = topic_counts.get(e['topic'],0)+1
        if len(chosen) == limit:
            break
    return chosen

def spark(m, now, color):
    points = [x for x in m.get('history',[]) if x.get('p') is not None and 0 <= x['p'] <= 1 and now-14*DAY <= x['t'] <= now]
    if m['p'] is not None:
        points.append({'t':now,'p':m['p']})
    points = sorted({x['t']:x for x in points}.values(),key=lambda x:x['t'])
    if len(points) < 2 or points[-1]['t']-points[0]['t'] < 3600:
        return '<div class="empty-chart">历史不足，趋势图将在取得可比观测后显示</div>'
    groups, current = [], []
    for p in points:
        if current and p['t']-current[-1]['t'] > 36*3600:
            groups.append(current); current=[]
        current.append(p)
    if current: groups.append(current)
    def xy(x): return (48+(x['t']-(now-14*DAY))/(14*DAY)*660, 156-x['p']*124)
    svg = ['<svg class="chart" viewBox="0 0 760 190" role="img" aria-label="最近14天概率趋势，纵轴0到100%">']
    for p in (0,.5,1):
        y = 156-p*124
        svg.append(f'<line x1="48" y1="{y}" x2="708" y2="{y}" stroke="#dfe7e4"/><text x="3" y="{y+4}" fill="#687b75" font-size="11">{p*100:.0f}%</text>')
    for g in groups:
        pts = ' '.join(f'{xy(x)[0]:.1f},{xy(x)[1]:.1f}' for x in g)
        svg.append(f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="2.5"/>')
    for x in (points[0],points[-1]):
        xx, yy=xy(x)
        svg.append(f'<circle cx="{xx:.1f}" cy="{yy:.1f}" r="3" fill="{color}"><title>{esc(clock(x["t"]))} {probability(x["p"])}</title></circle>')
    svg.append(f'<text x="48" y="180" fill="#687b75" font-size="11">{date(now-14*DAY)}</text><text x="636" y="180" fill="#687b75" font-size="11">{date(now)}</text></svg>')
    return ''.join(svg)

def table(e):
    rows=[]
    for m in sorted(e['markets'],key=lambda m:-m['volume']):
        cells=[]
        for d in (1,7,14):
            v=change(m,d)
            base=m.get('changes',{}).get(str(d),{}).get('baseline')
            tip = f"基准 {clock(base['t'])} · {probability(base['p'])} · {base.get('source','历史')}" if base else '目标时刻前6小时内无可靠观测'
            cells.append(f'<td title="{esc(tip)}" class="{"up" if v is not None and v>0 else "down" if v is not None and v<0 else ""}">{"—" if v is None else f"{v:+.1f}"}</td>')
        label = esc(m['label'])
        if not m.get('quality'): label += '<small>报价或成交未达筛选门槛</small>'
        rows.append(f'<tr><td>{label}</td><td class="prob">{probability(m["p"])}</td>{"".join(cells)}</tr>')
    return '<div class="table-wrap"><table><thead><tr><th>预测结果</th><th>当前概率</th><th>1日 Δ</th><th>7日 Δ</th><th>14日 Δ</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div>'

def card(e, now, research=False, i=0):
    m, d, v = strongest(e)
    deadline = ('市场到期参考：'+clock(e['end'])+'（非核实日历）') if e.get('end') else '到期时间待核实'
    unit = 'USD（平台成交口径）' if e['platform']=='Polymarket' else '份合约'
    reasons = '；'.join(e['reasons'])
    if not e['signal'] and research:
        reasons = '相关主题中成交活跃度较高，作为研究观察；不代表已确认趋势突破'
    body = f'<article class="card"><div class="eyebrow">{esc(e["topic"])} <span>{esc(e["platform"])}</span></div><h3>{esc(e["title"])}</h3><p class="fact">{esc(facts(e))}</p>'
    body += '<p class="why">'+esc(reasons)+'</p>'+table(e)
    body += '<details '+('open' if i<2 else '')+'><summary>查看代表结果的14天趋势</summary><p class="muted">'+esc(m['label'])+'</p>'+spark(m,now,COLORS[i%len(COLORS)])+'</details>'
    if research:
        body += '<div class="research"><b>值得研究的问题</b><p>'+esc(e['question'])+'</p><small>规则生成的研究方向，不是新闻归因或投资结论。</small></div>'
    body += f'<footer>24h成交 {e["volume"]:,.0f} {unit} · {esc(deadline)}<br>采集 {clock(e["captured_at"])} 北京时间 · <a href="{esc(e["url"])}" target="_blank" rel="noopener noreferrer">原始市场／官方数据 ↗</a></footer></article>'
    return body

CSS = '''
:root{color-scheme:light;--ink:#17352e;--muted:#62766f;--bg:#f3f6f2;--green:#166b56}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.7 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1180px;margin:auto;padding:32px 28px 70px}header.hero{padding:32px 0 22px;border-bottom:1px solid #cbd9cf}.kicker{font-size:12px;letter-spacing:2px;color:var(--green);font-weight:700}h1{font-size:42px;line-height:1.2;letter-spacing:-1px;margin:14px 0}h2{font-size:26px;margin:40px 0 8px}h3{font-size:21px;line-height:1.45;margin:10px 0 16px}.intro{max-width:780px;font-size:17px;color:var(--muted)}.meta,.muted{color:var(--muted);font-size:13px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}.metric{border:1px solid #d7e2d9;border-radius:12px;padding:18px;background:#fff}.metric b{display:block;font-size:27px}.metric span{font-size:12px;color:var(--muted)}nav{display:flex;gap:22px;flex-wrap:wrap;margin:20px 0}a{color:var(--green);text-underline-offset:3px}.notice{padding:16px 20px;background:#fff1d8;border:1px solid #ecd3a9;border-radius:12px;margin:18px 0}.notice.good{background:#e8f1ea;border-color:#ccdfd0}.card{background:white;border:1px solid #d8e2db;border-radius:15px;padding:25px;margin:18px 0;box-shadow:0 3px 12px #18362c04}.eyebrow{font-size:12px;color:var(--green);font-weight:700}.eyebrow span{margin-left:12px;border:1px solid #d4dfd7;border-radius:99px;padding:3px 10px;font-weight:500}.fact{font-size:16px;background:#f3f7f4;padding:12px 15px;border-left:3px solid var(--green)}.why{font-size:13px;color:var(--muted)}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{padding:11px 9px;border-bottom:1px solid #e6ece7;text-align:right;white-space:nowrap}th:first-child,td:first-child{text-align:left;white-space:normal;min-width:240px;max-width:540px}th{color:var(--muted);font-weight:500}.prob{font-weight:750;font-size:18px}.up{color:#15795b}.down{color:#a95c2a}small{display:block;color:var(--muted);font-size:11px}.research{background:#f7f5ed;padding:14px 18px;border-radius:8px;margin-top:18px}.research p{margin:6px 0}footer{font-size:11px;color:var(--muted);border-top:1px solid #e6ece7;padding-top:14px;margin-top:20px}.chart{width:100%;max-height:240px}.empty-chart{padding:25px;color:var(--muted);font-size:13px}details{margin:14px 0}summary{cursor:pointer;font-size:13px;color:var(--green)}.section-note{color:var(--muted);margin-top:0}.topic-list{display:flex;flex-wrap:wrap;gap:9px}.topic-list span{padding:7px 13px;background:#e5eee6;border-radius:99px;font-size:13px}.method{background:#e9efe8;border-radius:14px;padding:22px;margin-top:35px}.archive a{display:inline-block;padding:6px 14px;margin:4px;border:1px solid #d3dfd5;border-radius:8px}.status{font-size:13px}.missing{background:#fff1d8;padding:12px;border-radius:8px}@media(max-width:650px){main{padding:18px 14px 40px}h1{font-size:32px}.metrics{grid-template-columns:repeat(2,1fr)}.card{padding:17px}h3{font-size:19px}th:first-child,td:first-child{min-width:190px}th,td{padding:9px 6px}}
'''

def build_report(run, config, root:Path, site:Path, state):
    now, events = run['captured_at'],run['events']
    day=date(now)
    log_path=root/'data'/'featured.json'
    log=json.loads(log_path.read_text(encoding='utf-8')) if log_path.exists() else []
    # Re-running the same day recomputes its report instead of suppressing its own picks.
    previous=[p for p in log if date(p['t']) != day and now-p['t'] <= 30*DAY]
    selected=pick(events,previous,now)
    watches=sorted([e for e in events if e['watch']],key=lambda e:(not e['manual'], not(e['topic']=='Fed 利率决议'),
                   not(e['end'] and -2*DAY <= e['end']-now <= 45*DAY),
                   not bool(re.search(r'fed decision',e['title'],re.I)),e['end'] or float('inf'),-e['score']))
    # Diverse compact lead table; all tracked markets remain in expandable appendix.
    top, rest, per_topic=[],[],{}
    for e in watches:
        if len(top)<8 and (e['manual'] or per_topic.get(e['topic'],0)<3):
            top.append(e);per_topic[e['topic']]=per_topic.get(e['topic'],0)+1
        else: rest.append(e)
    current={e['key'] for e in events}
    missing=[v for k,v in state.items() if k not in current and (v.get('fixed') or v.get('manual') or v.get('last_signal')) and now-v.get('last_seen',now)<30*DAY]
    summaries=[facts(e) for e in selected]
    output={'schema_version':1,'date':day,'captured_at':now,'sources':run['sources'],'selected_keys':[e['key'] for e in selected],
            'watch_keys':[e['key'] for e in watches],'summaries':summaries,'events':events,'model':{'enabled':False}}
    output['model']=enrich(output,config)
    topics={}
    for e in events:topics[e['topic']]=topics.get(e['topic'],0)+1
    failures=[p for p,s in run['sources'].items() if s['status']!='ok']
    body=['<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
          '<meta name="description" content="每日预测市场研究雷达：重点事件概率趋势、宏观科技商业研究选题。零模型调用。">',
          f'<title>{day} · 预测市场研究雷达</title><style>{CSS}</style></head><body><main>',
          '<header class="hero"><div class="kicker">PREDICTION RADAR / DAILY BRIEF</div><h1>预测市场研究雷达</h1>',
          '<p class="intro">跟踪重要事件的预期变化，发现值得继续研究的宏观、科技与商业话题。</p>',
          f'<p class="meta">{day} · {clock(now)} 北京时间采集 · 每日09:00计划运行 · 规则生成 / 零模型调用</p></header>',
          '<nav><a href="#signals">今日研究精选</a><a href="#watch">重点事件</a><a href="#archive">历史日报</a><a href="#method">数据口径</a><a href="report.json">结构化数据</a></nav>',
          '<div class="metrics">'+''.join(f'<div class="metric"><b>{n}</b><span>{label}</span></div>' for n,label in [(len(events),'相关事件'),(len(watches),'持续跟踪'),(len(selected),'研究精选'),(len([s for s in run['sources'].values() if s['status']=='ok']),'完整采集的平台 / 2')])+'</div>']
    if failures:
        body.append('<div class="notice"><b>本次数据不完整</b> · '+esc('、'.join(failures))+' 未完整取得。缺失不代表概率为零；本页不会把旧数据标成今日行情。</div>')
    else:body.append('<div class="notice good">两平台本次采集完成。Δ 均为百分点；“—”表示缺少可靠历史，不代表没有变化。</div>')
    body.append('<div class="status">'+''.join(f'<p><b>{esc(p)}</b> · {esc(s["status"])} · 扫描 {s["scanned_events"]:,} 个事件'+(' · '+esc(s['error']) if s.get('error') else '')+'</p>' for p,s in run['sources'].items())+'</div>')
    body.append('<div class="topic-list">'+''.join(f'<span>{esc(t)} {n}</span>' for t,n in topics.items())+'</div>')
    body.extend(['<section id="signals"><h2>今日研究精选</h2><p class="section-note">依据概率变化、成交活跃度与主题相关性筛选；不足5项时不凑数。研究问题由模板生成。</p>'])
    if selected:
        body.extend(card(e,now,True,i) for i,e in enumerate(selected))
    else:body.append('<div class="card">本次没有取得足够的合格新选题。已有重点事件仍持续跟踪。</div>')
    body.append('</section><section id="watch"><h2>重点事件持续跟踪</h2><p class="section-note">固定关注不因重复而移除。即使单日变化很小，仍展示一周和两周累计变化。</p>')
    body.extend(card(e,now,False,i) for i,e in enumerate(top))
    if not top:body.append('<div class="card">固定监测 Fed、通胀就业、贸易关税；本次暂无可展示行情。</div>')
    if rest:body.append(f'<details><summary>展开其余 {len(rest)} 个重点事件</summary>'+''.join(card(e,now,False,i+8) for i,e in enumerate(rest))+'</details>')
    if missing:body.append('<details class="missing"><summary>此前关注但本次未取得的事件（状态待核实）</summary><ul>'+''.join(f'<li>{esc(v.get("title",""))} · 最后取得 {clock(v["last_seen"])}；不自动认定已结算</li>' for v in missing)+'</ul></details>')
    body.append('</section>')
    site.mkdir(parents=True,exist_ok=True)
    archives=sorted(set([p.stem for p in (site/'archive').glob('*.html')]+[day]),reverse=True)
    body.append('<section id="archive" class="archive"><h2>历史日报</h2>'+''.join(f'<a href="archive/{x}.html">{x}</a>' for x in archives[:45])+'</section>')
    body.append('''<section class="method" id="method"><h2>阅读口径</h2><ul>
<li>当前概率不是参与者人数占比。Polymarket 使用 outcomePrices，Kalshi 使用 YES 买卖报价中点。不同平台不相加成交量、不平均概率。</li>
<li>1／7／14日变化以当前采集时刻为终点，取目标时刻之前最多6小时内最近的可比观测；悬停变化数值可见基准时间和价格。图中超过36小时的数据空档断开显示。</li>
<li>趋势图展示该事件中变化显著或成交活跃的一个代表结果；表格保留所有取得的结果。市场到期时间不能直接当作政策公告时间。</li>
<li>低成交、宽价差或报价缺失的结果仍可列入固定关注，但不作为自动强信号。所有有效结果均接近0%或100%的事件不进入新选题。新选题7日内重复需较上次推荐发生至少3个百分点的新变化。</li>
<li>自动重点阈值：7日变化≥10个百分点、14日≥15个百分点，或成交达到前7个完整日均值的2倍。历史补取有上限；其余逐日累积，不编造历史。</li>
<li>相同主题可同时显示两平台事件；具体条件、日期和结算规则以原始市场为准。平台共同关注不等于独立证据。</li>
<li>本日报不调用模型、不提供新闻归因；未来模型输出接入独立注释层，不覆盖原始数值。首次观测不等于事件首次上市。</li>
</ul><p><a href="https://github.com/daisypku/public-pages/actions/workflows/prediction-radar.yml">查看采集运行记录</a> · <a href="https://github.com/daisypku/public-pages/tree/main/research-radar">规则与源代码</a></p></section>''')
    body.append('</main></body></html>')
    content=''.join(body)
    (site/'index.html').write_text(content,encoding='utf-8')
    (site/'report.json').write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    archive=site/'archive';archive.mkdir(exist_ok=True)
    # Relative links work from archived pages as well.
    archived=content.replace('href="archive/','href="').replace('href="report.json"',f'href="{day}.json"')
    (archive/(day+'.html')).write_text(archived,encoding='utf-8')
    (archive/(day+'.json')).write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    for p in archive.iterdir():
        if p.suffix in ('.html','.json') and p.stem < date(now-45*DAY):p.unlink()
    new_log=previous+[{'t':now,'key':e['key'],'prices':{m['id']:m['p'] for m in e['markets']}} for e in selected]
    if events:
        log_path.parent.mkdir(parents=True,exist_ok=True)
        log_path.write_text(json.dumps(new_log,ensure_ascii=False,indent=2),encoding='utf-8')
    return output
