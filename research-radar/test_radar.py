import copy
import json
from pathlib import Path
import tempfile
import unittest
import radar

CONFIG = json.loads((Path(__file__).parent/'config.json').read_text(encoding='utf-8'))
NOW = 1800000000

def fixture(title='Fed decision in September?', price='0.87'):
    return {'id':'fixture', 'title':title, 'slug':'fixture', 'markets':[{'id':'market', 'question':title,
        'active':True, 'outcomes':'["No", "Yes"]', 'outcomePrices':json.dumps(['0.13',price]),
        'clobTokenIds':'["no-token", "yes-token"]', 'volume24hr':50000, 'bestBid':0.86, 'bestAsk':0.88}]}

class RadarTests(unittest.TestCase):
    def test_yes_mapping(self):
        e = radar.normalize('Polymarket', fixture(), CONFIG, NOW)
        self.assertEqual(e['markets'][0]['p'], .87)
        self.assertEqual(e['markets'][0]['token'], 'yes-token')

    def test_historical_trend_and_no_fake_baseline(self):
        e = radar.normalize('Polymarket', fixture(), CONFIG, NOW)
        e['markets'][0]['history'] = [{'t':NOW-7*radar.DAY, 'p':.42}]
        radar.analyze([e], [], CONFIG, NOW, {})
        self.assertEqual(e['markets'][0]['changes']['7']['pp'],45)
        self.assertIsNone(e['markets'][0]['changes']['14']['pp'])
        self.assertTrue(e['watch'])

    def test_no_future_or_stale_baseline(self):
        self.assertIsNone(radar.prior([{'t':NOW+1,'p':.5}],NOW))
        self.assertIsNone(radar.prior([{'t':NOW-7*3600,'p':.5}],NOW))

    def test_fixed_event_persists_without_signal(self):
        e = radar.normalize('Polymarket', fixture(), CONFIG, NOW)
        radar.analyze([e], [], CONFIG, NOW, {})
        self.assertTrue(e['watch'])
        self.assertFalse(e['signal'])

    def test_low_volume_does_not_trigger(self):
        e = radar.normalize('Polymarket', fixture('OpenAI new model?'), CONFIG, NOW)
        e['markets'][0]['volume'] = 1
        e['markets'][0]['history'] = [{'t':NOW-7*radar.DAY,'p':.1}]
        radar.analyze([e], [], CONFIG, NOW, {})
        self.assertFalse(e['signal'])
        self.assertFalse(e['watch'])

    def test_missing_quote_is_not_zero(self):
        e = radar.normalize('Kalshi', {'title':'Fed rate decision?', 'event_ticker':'FIXTURE', 'markets':[
            {'ticker':'X', 'status':'active', 'yes_ask_dollars':'.4', 'volume_24h_fp':'10000'}]},CONFIG,NOW)
        self.assertIsNone(e['markets'][0]['p'])

    def test_repeated_runs_do_not_create_seven_days(self):
        e = radar.normalize('Polymarket', fixture(), CONFIG, NOW)
        old = copy.deepcopy(e)
        old['captured_at'] = NOW-radar.DAY
        radar.analyze([e],[{'events':[old]}]*8,CONFIG,NOW,{})
        self.assertIsNone(e['volume_multiple'])

    def test_sports_excluded(self):
        self.assertIsNone(radar.normalize('Polymarket',fixture('NBA market cap game'),CONFIG,NOW))

if __name__ == '__main__':
    unittest.main()
