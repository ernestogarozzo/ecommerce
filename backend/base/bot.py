from .models import BotData, BotParams
from binance.client import Client
from binance import ThreadedWebsocketManager
from binance.enums import *
import talib, numpy, json, sys, websocket, pprint, time

# set default params
data_input = {
    "ASSET_PRECISION" : 6,
    "TIME_BUY" : 10,
    "TIME_SELL" : 10,
    "RSI_PERIOD" : 14,
    "asset" : "BTC",
    "stable" : "USDT",    
    "moveAvgFast" :  0,
    "moveAvgSlow" :  0,
    "rsiBuy" : 0,
    "rsiSell" : 0,
    "marginSell": 0,
    "percToSell": 0,
    "timeframe": "1m"
}

# Client
client = ''

ASSET_PRECISION = data_input['ASSET_PRECISION']
RSI_PERIOD = data_input['RSI_PERIOD']
TIME_BUY = data_input['TIME_BUY']
TIME_SELL = data_input['TIME_SELL']

#frontend params
asset = data_input['asset']
stable = data_input['stable']
moveAvgFast =  data_input['moveAvgFast']
moveAvgSlow =  data_input['moveAvgSlow']
rsiBuy = data_input['rsiBuy']
rsiSell = data_input['rsiSell']
marginSell = data_input['marginSell']
percToSell = data_input['percToSell']
timeframe = data_input['timeframe']

#initVar do not touch
start_Buy = moveAvgSlow
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
bal_stable_init = 0
bnb_fees = 0

#test params
cap_unit = 30
bal_asset = 0
bal_stable = 1000
bal_stable_init = bal_stable
   

# data model
def saveBotTestData(
    params,
    openTime,
    open,
    high,
    low,
    close,
    volume,
    closeTime,
    rsiZero,
    rsiOne,
    rsiTwo,
    sold,
    bought,
    balanceAssetBought,
    balanceAssetSold,
    avgSellPrice,
    avgBuyPrice,
    balanceStable,
    balanceAsset,
    avgFast,
    avgSlow
    ):    

    data = BotData()

    data.avgFast = avgFast
    data.avgSlow = avgSlow
    data.avgBuyPrice = avgBuyPrice
    data.avgSellPrice = avgSellPrice
    data.balanceAsset = balanceAsset
    data.balanceStable = balanceStable
    data.balanceAssetBought = balanceAssetBought
    data.balanceAssetSold = balanceAssetSold
    data.sold = sold
    data.bought = bought
   
    data.rsiTwo = rsiTwo
    data.rsiOne = rsiOne
    data.rsiZero = rsiZero
    
    data.openTime = openTime
    data.closeTime = closeTime

    data.open = float(open)
    data.high = float(high) 
    data.low = float(low)
    data.close = float(close)
    data.volume = float(volume)  
    data.idParams = params
   
    data.save()

# params model
def saveBotTestParams(cap_unit,bal_asset,bal_stable, timestamp):    
    data = BotParams()

    data.assetPrecision = ASSET_PRECISION        
    data.rsiPeriod = RSI_PERIOD
    data.moveAvgFast = moveAvgFast 
    data.moveAvgSlow = moveAvgSlow 
    data.rsiBuy = rsiBuy 
    data.rsiSell = rsiSell
    data.timeBuy = TIME_BUY 
    data.timeSell = TIME_SELL

    data.percToSell = percToSell
    data.marginSell = marginSell 

    data.asset = asset
    data.stable = stable
    
    data.initBalStable = bal_stable
    data.initBalAsset = bal_asset
    data.capitalUnit = cap_unit

    data.timestamp = int(timestamp)

    data.save()

    return data


# BUY LOGIC    
def buy(price, avg_fast, avg_slow, rsi_0, rsi_1, rsi_2):  
    global bal_asset_bought, bought, wait_buy, bal_asset, bal_stable, cap_unit, bnb_fees
    global asset, stable, rsiBuy

    condition = (not wait_buy
                and bal_stable > 0 
                and avg_fast < avg_slow 
                and rsi_1 < rsiBuy 
                and rsi_1 < rsi_0 
                and rsi_2 > rsi_1)
        
    if  condition :        
        #calcolo quantità da comprare: 30$
        x = round(cap_unit/price, ASSET_PRECISION)
        price = round(price,2)
        
        print("Condition satisfied, try with: {}, notional {}".format(x,x*price))

        #verifica disponibilità 
        if bal_stable > cap_unit:
            order_succeeded = True     
        else:
            order_succeeded = False
            print("no stable...")

        if order_succeeded:
            print("Order confirmed...")
            wait_buy = True
            bnb_fees += x*price*0.00075
                
            print("...and filled!")
            print("{} amount: {} bought at {} {} ".format(asset,x,price,stable))
            bal_asset +=x
            bal_stable -=x*price
            #get_balances()

            #calcolo nuovo prezzo medio di acquisto
            bal_asset_bought += x
            bought += x*price
        else:
            print("WARNING, something goes wrong: order didn't succeed...")

# SELL LOGIC
def sell(price, avg_fast, avg_slow, rsi_0, rsi_1, rsi_2, avg_buy_price):  
    global bal_asset_sold, sold, wait_sell, bal_asset, bal_stable, bal_asset_bought, bought, bnb_fees
    global asset, stable, rsiSell, marginSell, percToSell

    limit_sell = round(avg_buy_price * marginSell,2)
    condition = (not wait_sell
                and bal_asset > 0 
                and price > limit_sell
                and avg_fast > avg_slow 
                and rsi_1 > rsiSell 
                and rsi_1 > rsi_0 
                and rsi_2 < rsi_1)

    if condition:        
        #calcolo quantità da vendere: 30$
        x = round(bal_asset * percToSell, ASSET_PRECISION)
        price = round(price,2)
              
        print("Condition satisfied, try with: {}, notional {}".format(x,x*price))      

        #verifica disponibilità    
        if bal_asset >= x and x*price > 10:
            order_succeeded = True
        else:
            order_succeeded = False
            print("no asset...")

        if order_succeeded:
            print("Order confirmed...")
            wait_sell = True
            bnb_fees += x*price*0.00075

            print("...and filled!")
            print("{} amount: {} sold at {} {}".format(asset,x,price,stable))
            bal_asset -=x
            bal_stable +=x*price
            #get_balances()

            #calcolo nuovo prezzo medio di acquisto
            bal_asset_sold += x
            sold += x*price

            #reset buy
            bal_asset_bought = 0
            bought = 0
        else:
            print("WARNING, something goes wrong: order didn't succeed...")

# FAKE ROUTINE 
def routine(bars, params):
    global bal_asset_bought, bal_asset_sold, bought, sold, wait_buy, wait_sell
    global bal_asset, bal_stable, timer_buy, timer_sell
    global moveAvgFast, moveAvgSlow

    for index in range(len(data_closes)):

        #test
        time.sleep(10)

        closes.append(data_closes[index])
        close = data_closes[index]

        #start computing RSI
        if len(closes) > RSI_PERIOD:
            np_closes = numpy.array(closes)
            rsi = talib.RSI(np_closes, RSI_PERIOD)
            rsi_2 = rsi[-1] #now
            if len(rsi)>2:
                rsi_1 = rsi[-2] #bottom/top
                rsi_0 = rsi[-3] #before
            else:
                rsi_1 = rsi[-1] #bottom/top
                rsi_0 = rsi[-1] #before
            
            #percentuale di bal_stablee iniziale in BTC
            #r_cap = abs(bal_stable_init - bal_stable)/bal_stable_init

            #START BOT TRADING
            if len(closes) > start_Buy:
                #calcolo medie mobili e stdev mobile
                avg_fast = float(numpy.mean(closes[-moveAvgFast:]))
                avg_slow = float(numpy.mean(closes[-moveAvgSlow:]))        
                dev = float(numpy.std(closes))
            
                
                #calcolo del prezzo di acquisto medio
                if bal_asset_bought == 0.0:
                    avg_buy_price = 40000
                else:
                    avg_buy_price = bought/bal_asset_bought
                    print("Avg buy price: {}".format(avg_buy_price))

                #calcolo del prezzo di vendita medio
                if bal_asset_sold == 0.0:
                    avg_sell_price = 1000000
                else:
                    avg_sell_price = sold/bal_asset_sold
                    print("Avg sell price: {}".format(avg_sell_price))


                #wait timers
                if wait_buy:
                    if timer_buy > TIME_BUY:
                        wait_buy = False
                        timer_buy = 0
                    else:
                        timer_buy += 1
                        print("wait buy : {}, timer: {}".format(wait_buy,timer_buy))
                if wait_sell:
                    if timer_sell > TIME_SELL:
                        wait_sell = False
                        timer_sell = 0
                    else:
                        timer_sell += 1
                        print("wait sell : {}, timer: {}".format(wait_sell,timer_sell))


                #BUY                     
                buy(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2)
                
                #SELL                                         
                sell(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2, avg_buy_price=avg_buy_price)
                
                #stampa risultati    
                to_save = str(close) + " , " + str(rsi_2) + " , " + str(bal_asset) + " , " + str(bal_stable) + "\n"
                print(to_save)

                trueIndex = 240 + index     
                saveBotTestData(   
                    params=params,        
                    openTime = bars[trueIndex][0],
                    open = bars[trueIndex][1],
                    high = bars[trueIndex][2],
                    low = bars[trueIndex][3],
                    close = bars[trueIndex][4],
                    volume = bars[trueIndex][5],
                    closeTime = bars[trueIndex][6],        
                    rsiZero=rsi_0,
                    rsiOne=rsi_1,             
                    rsiTwo=rsi_2,
                    sold=sold,
                    bought=bought,
                    balanceAssetBought=bal_asset_bought,
                    balanceAssetSold=bal_asset_sold,                    
                    balanceStable=bal_stable,
                    balanceAsset=bal_asset,
                    avgBuyPrice=avg_buy_price,
                    avgSellPrice=avg_sell_price,
                    avgFast=avg_fast,
                    avgSlow=avg_slow
                )

#get-wallet-info
def walletInfo(apikey, secretkey):
    global client

    #setup client 
    client = Client(apikey, secretkey)
    client.API_URL = 'https://testnet.binance.vision/api'

    wallet = client.get_account()

    return wallet


# main called by /model view
def main(
    _asset,
    _stable,
    _timeframe, 
    _rsiBuy, 
    _rsiSell, 
    _moveAvgFast, 
    _moveAvgSlow, 
    _marginSell, 
    _percToSell,
    _timestamp
    ):
    global client, data_input
    global asset, stable, timeframe, rsiBuy, rsiSell, moveAvgFast, moveAvgSlow, marginSell, percToSell

    #set params
    asset = _asset
    stable = _stable
    timeframe = _timeframe
    rsiBuy = int(_rsiBuy)
    rsiSell = int(_rsiSell)
    moveAvgFast = int(_moveAvgFast)
    moveAvgSlow = int(_moveAvgSlow)
    marginSell = float(_marginSell)
    percToSell = float(_percToSell)
   
    #get first moveAvgSlow candles
    now = int(time.time())
    timestamp = ( now - ( moveAvgSlow + 1440*4 )*60 )*1000

    #request historical candle (or klines) data
    bars = client.get_historical_klines(asset + stable, timeframe, timestamp)
    print("Bot is ready...")
    
    for i in range(240):
        closes.append(float(bars[i][4]))

    for i in range(240,len(bars)):
        data_closes.append(float(bars[i][4]))

    params = saveBotTestParams(cap_unit, bal_asset,bal_stable, _timestamp)
    
    routine(bars, params)

