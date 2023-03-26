from binance.client import Client
from binance import ThreadedWebsocketManager
from binance.enums import *
import talib, numpy, json, sys, websocket, pprint, time

#setup client 
client = Client("NwZlCXwJ0fPAgM19NWmDfN8B5YfmZxkV287AFk6WWnYYyiP6kODFnNwL5pCn1YFj", "E8KeI6V3uIE2taqhq0f0bVtPgubHTW6YvyiEewA1r2oBJBkYTkYW7Xb3dw1NDoiQ")
client.API_URL = 'https://testnet.binance.vision/api'
TIMEOUT = 60*60*24*2
open_time = 0
t_0 = time.time()
t_1 = 0

#input file params
file_name = str(sys.argv[1])
f = open(file_name,'r')
data_input= json.load(f)
f.close()
data_test_id = data_input['data_test_id']
asset = data_input['asset']
ASSET_PRECISION = data_input['ASSET_PRECISION']
stable = data_input['stable']
RSI_PERIOD = data_input['RSI_PERIOD']
MoveAvg_FAST =  data_input['MoveAvg_FAST']
MoveAvg_SLOW =  data_input['MoveAvg_SLOW']
RSI_BUY = data_input['RSI_BUY']
RSI_SELL = data_input['RSI_SELL']
TIME_BUY = data_input['TIME_BUY']
TIME_SELL = data_input['TIME_SELL']
MARGIN_SELL = data_input['MARGIN_SELL']
PERC_TO_SELL = data_input['PERC_TO_SELL']



#init  do not touch
start_Buy = MoveAvg_SLOW
#bal_asset = 0
#bal_stable = 0
bal_asset_bought = 0
bought = 0
bal_asset_sold = 0
sold =  0
timer_sell = 0
timer_buy = 0
wait_buy = False
wait_sell = False
closes = []
data_closes = []

#variables
n_candle = 0
temp_price = 0
temp_qty = 0
not_filled = False
order_id = ""
bal_stable_init = 0
wait_nf_order = 0
bnb_fees = 0

