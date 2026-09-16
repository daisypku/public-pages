import copy
import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import radar
import report
import model_hook
from test_radar import CONFIG,NOW,fixture

def event():
    e=radar.normalize('Polymarket',fixture(),CONFIG,NOW)
    e['markets'][0]['history']=[{'t':NOW-7*radar.DAY,'p':.42}]
    radar.analyze([e],[],CONFIG,NOW,{})
    return e

class ReportTests(unittest.TestCase):
    def test_report_has_complete_sections_without_model(self):
        with tempfile.TemporaryDirectory() as tmp:
            e=event()
            run={'captured_at':NOW,'sources':{'Polymarket':{'status':'ok','scanned_events':1}},'events':[e]}
            with patch('urllib.request.urlopen',side_effect=AssertionError('Unexpected network')):
                output=report.build_report(run,CONFIG,Path(tmp),Path(tmp)/'site',{})
            page=(Path(tmp)/'site/index.html').read_text(encoding='utf-8')
            for value in ('今日研究精选','重点事件持续跟踪','历史日报','87.0%','+45.0','<svg'):
                self.assertIn(value,page)
            self.assertFalse(output['model']['enabled'])
            self.assertEqual(len(output['selected_keys']),1)

    def test_model_default_never_calls_provider(self):
        class Bad:
            def enrich(self,report):raise AssertionError('must not call')
        self.assertFalse(model_hook.enrich({},CONFIG,Bad())['enabled'])

    def test_model_opt_in_requires_provider(self):
        with self.assertRaises(RuntimeError):model_hook.enrich({}, {'model':{'enabled':True}})

    def test_untrusted_title_escaped(self):
        e=event();e['title']='<script>alert(1)</script>'
        self.assertNotIn('<script>',report.card(e,NOW))

    def test_repeated_pick_requires_new_change(self):
        e=event()
        old=[{'key':e['key'],'t':NOW-radar.DAY,'prices':{'market':.87}}]
        self.assertEqual(report.pick([e],old,NOW),[])
        old[0]['prices']['market']=.80
        self.assertEqual(len(report.pick([e],old,NOW)),1)

    def test_same_family_not_fill_five(self):
        a=event();b=copy.deepcopy(a);b['key']='different';b['title']='Fed decision next month?'
        self.assertEqual(len(report.pick([a,b],[],NOW)),1)

    def test_almost_resolved_event_not_a_new_research_pick(self):
        e=event();e['markets'][0]['p']=1
        self.assertEqual(report.pick([e],[],NOW),[])

    def test_symmetric_move_highlights_larger_probability(self):
        e=event();m=copy.deepcopy(e['markets'][0]);m['p']=.13;m['changes']['7']['pp']=-45
        e['markets'].insert(0,m)
        self.assertEqual(report.strongest(e)[0]['p'],.87)

    def test_failure_generates_complete_honest_page(self):
        with tempfile.TemporaryDirectory() as tmp:
            report.build_report({'captured_at':NOW,'events':[],'sources':{'Kalshi':{'status':'failed','scanned_events':0,'error':'timeout'}}},CONFIG,Path(tmp),Path(tmp)/'site',{})
            page=(Path(tmp)/'site/index.html').read_text(encoding='utf-8')
            self.assertIn('本次数据不完整',page)
            self.assertIn('今日研究精选',page)

    def test_cli_success_then_failed_retry_preserves_daily_history(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)/'runtime';site=Path(tmp)/'site'
            args=['radar.py','--root',str(root),'--site',str(site)]
            def collect(platform,*a):
                return ([event()] if platform=='Polymarket' else []), {'status':'ok','scanned_events':1}
            with patch('sys.argv',args),patch('radar.collect',side_effect=collect),patch('radar.enrich_history'),patch('radar.time.time',return_value=NOW),contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(radar.main(),0)
            snapshots=list((root/'data/snapshots').glob('*.json'))
            data=json.loads(snapshots[0].read_text(encoding='utf-8'))
            self.assertNotIn('history',data['events'][0]['markets'][0])
            with patch('sys.argv',args),patch('radar.collect',return_value=([],{'status':'failed','scanned_events':0,'error':'timeout'})),patch('radar.enrich_history'),patch('radar.time.time',return_value=NOW+60),contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(radar.main(),2)
            saved=json.loads(snapshots[0].read_text(encoding='utf-8'))
            self.assertEqual(len(saved['events']),1)
            current=json.loads((site/'report.json').read_text(encoding='utf-8'))
            self.assertEqual(current['events'],[])

if __name__=='__main__':unittest.main()
