from params import *
import functions as fn

#init cap_unit
wallet = client.get_account()
balances = wallet['balances']

for item in balances:
    if item['asset'] == stable:
        bal_stable_init = float(item['free'])
        cap_unit = data_input["CAP_UNIT"]
   

#get first 260 candles
now = int(time.time())
timestamp = (now - 240*60)*1000

#request historical candle (or klines) data
bars = client.get_historical_klines(asset + stable, '1m', timestamp)

for i in range(240):
    closes.append(float(bars[i][4]))

#init capital
fn.get_balances()

print("Start time: {}, cap_unit {}, capital_init {}".format(t_0,cap_unit,bal_stable_init))

telegram_send.send(messages=["Easy-Bot started"])


bsm = fn.start_WS()

