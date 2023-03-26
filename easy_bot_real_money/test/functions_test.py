from params_test import *
from main_test import cap_unit, bal_asset, bal_stable

"""
#get balances from the account
def get_balances():
    global bal_asset, bal_stable

    wallet = client.get_account()
    balances = wallet['balances']

    for item in balances:
        if item['asset'] == asset:
            bal_asset = float(item['free'])
        if item['asset'] == stable:
            bal_stable = float(item['free'])

    print("{} balance: {} \n{} bal: {}".format(asset,bal_asset,stable,bal_stable))

#order function 
def order(side, quantity, symbol, order_type, price):
    global temp_price, temp_qty, not_filled, order_id
    temp_qty = 0
    temp_price = 0
    r_quantity = round(quantity,ASSET_PRECISION)
    r_price = round(price,2)
    print("try with: {}".format(r_quantity))
   
    try:
        print("Sending order....")
        order = client.create_order(symbol=symbol, side=side, type=order_type, timeInForce='GTC', quantity=r_quantity, price=r_price)
        pprint.pprint(order)

        if order['status'] == "NEW":

            # not filled order
            not_filled = True
            order_id = int(order['orderId'])
            print("order not filled... id: {}".format(order_id))

        if order['status'] == "PARTIALLY_FILLED":
            
            #partially filled order
            not_filled = True
            order_id = int(order['orderId'])
            print("order partially filled... id: {}".format(order_id))

            data_order = open("data_run/orders_{}.txt".format(data_test_id),'a')
            data_order.write(pprint.pformat(order) + "\n --------- \n")
            data_order.close()

            for item in order['fills']:
                temp_price += float(item['price'])*float(item['qty'])
                temp_qty += float(item['qty'])
            temp_price = temp_price/temp_qty

        if order['status'] == "FILLED":

            data_order = open("data_run/orders_{}.txt".format(data_test_id),'a')
            data_order.write(pprint.pformat(order) + "\n --------- \n")
            data_order.close()
            
            #filled order
            for item in order['fills']:
                temp_price += float(item['price'])*float(item['qty'])
                temp_qty += float(item['qty'])
            temp_price = temp_price/temp_qty
           
    except Exception as e:
        print("WARNING, an exception occurred: {}".format(e))
        return False
    return True
"""

#BUY LOGIC    
def buy(price, avg_fast, avg_slow, rsi_0, rsi_1, rsi_2):  
    global bal_asset_bought, bought, wait_buy, bal_asset, bal_stable, cap_unit, bnb_fees
    condition = (not wait_buy
                and bal_stable > 0 
                and avg_fast < avg_slow 
                and rsi_1 < RSI_BUY 
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
            print("{} amount: {} bought at {} {} ".format(asset,x,price,asset))
            bal_asset +=x
            bal_stable -=x*price
            #get_balances()

            #calcolo nuovo prezzo medio di acquisto
            bal_asset_bought += x
            bought += x*price
        else:
            print("WARNING, something goes wrong: order didn't succeed...")

#SELL LOGIC
def sell(price, avg_fast, avg_slow, rsi_0, rsi_1, rsi_2, avg_buy_price):  
    global bal_asset_sold, sold, wait_sell, bal_asset, bal_stable, cap_unit, bal_asset_bought, bought, bnb_fees
    limit_sell = round(avg_buy_price * MARGIN_SELL,2)
    condition = (not wait_sell
                and bal_asset > 0 
                and price > limit_sell
                and avg_fast > avg_slow 
                and rsi_1 > RSI_SELL 
                and rsi_1 > rsi_0 
                and rsi_2 < rsi_1)

    if condition:        
        #calcolo quantità da vendere: 30$
        x = round(bal_asset * PERC_TO_SELL, ASSET_PRECISION)
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


for index in range(len(data_closes)):

    closes.append(data_closes[index])
    close = data_closes[index]

    #start computing RSI
    if len(closes) > RSI_PERIOD:
        print("BOT is computing rsi...")
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
            print("BOT is ready...")
            #calcolo medie mobili e stdev mobile
            avg_fast = float(numpy.mean(closes[-MoveAvg_FAST:]))
            avg_slow = float(numpy.mean(closes[-MoveAvg_SLOW:]))        
            dev = float(numpy.std(closes))
        
            #catch not filled orders
            """
            if not_filled:
                order_nf = client.get_order(symbol= asset + stable, orderId = order_id)
                pprint.pprint(order_nf)
                if order_nf['status'] == "FILLED":
                    not_filled = False
                    pprint.pprint(order_nf)
                    print("...order has been filled!!")

                    #save filled order 
                    data_order = open("data_run/orders_{}.txt".format(data_test_id),'a')
                    data_order.write(pprint.pformat(order_nf) + "\n --------- \n")
                    data_order.close()

                    if order_nf['side'] == "BUY":
                        #calcolo nuovo prezzo medio di acquisto
                        bal_asset_bought += float(order_nf['origQty'])
                        bought += float(order_nf['price'])*float(order_nf['origQty'])
                        print("Quantity bought: {} at {}".format(order_nf['origQty'],order_nf['price']))
                    if order_nf['side'] == "SELL":
                        #calcolo nuovo prezzo medio di acquisto
                        bal_asset_sold += float(order_nf['origQty'])
                        sold += float(order_nf['price'])*float(order_nf['origQty'])
                        print("Quantity sold: {} at {}".format(order_nf['origQty'],order_nf['price']))
                else:
                    wait_nf_order +=1

            #cancel not filled order
            if wait_nf_order > 2:
                cancel_order = client.cancel_order(symbol= asset + stable, orderId = order_id)
                
                if cancel_order['status'] == "CANCELED":
                    print("Order id {}, has been canceled!".format(order_id))
                    wait_nf_order = 0
                    not_filled = False
                else:
                    print("unable to cancel the order id {}".format(order_id))
            """

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

            #get_balances()
            
            #BUY                     
            buy(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2)
            
            #SELL                                         
            sell(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2, avg_buy_price=avg_buy_price)

            
            #stampa risultati    
            to_save = str(close) + " , " + str(rsi_2) + " , " + str(bal_asset) + " , " + str(bal_stable) + "\n"
            data = open("data_test/data_{}.txt".format(data_test_id),'a')
            print(to_save)
            data.write(to_save)
            data.close()


cap_final = bal_stable + bal_asset*close
print("---- RESULT ---- \nBTC amount: {},\nBTC current price: {}, \nUSDT amount: {}, \nCurrent capital value: {}, \nBinance fees: {} $".format(round(bal_asset,ASSET_PRECISION), round(close,2), round(bal_stable,2),round(cap_final,2),round(bnb_fees,2)))
