from params_test import *
import functions_test as fn

"""
#init cap_unit
wallet = client.get_account()
balances = wallet['balances']

for item in balances:
    if item['asset'] == stable:
        bal_stable_init = float(item['free'])
        cap_unit = 30 
"""
cap_unit = 30
bal_asset = 0
bal_stable = 1000
bal_stable_init = bal_stable

#get first 260 candles
now = int(time.time())
timestamp = (now - (240+1440*4)*60)*1000

#request historical candle (or klines) data
bars = client.get_historical_klines(asset + stable, '1m', timestamp)
print(len(bars))

for i in range(240):
    closes.append(float(bars[i][4]))

for i in range(240,len(bars)):
    data_closes.append(float(bars[i][4]))

#init capital
#fn.get_balances()

print("Start time: {}, cap_unit {}, capital_init {}".format(t_0,cap_unit,bal_stable_init))


#bsm = fn.start_WS()

