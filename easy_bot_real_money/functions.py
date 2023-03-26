from params import *

def str_log(value,name):
    str_value = str(value) + " "
    len_value = len(str(value))
    len_name = len(name)
    if len_value < len_name :
        for i in range(len_name - len_value - 1):
            str_value = " " + str_value
    return str_value

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


#BUY LOGIC    
def buy(price, avg_fast, avg_slow, rsi_0, rsi_1, rsi_2):  
    global bal_asset_bought, bought, wait_buy, bal_stable, bal_asset, cap_unit, bnb_fees
    from main import cap_unit
    condition = (not wait_buy
                and bal_stable > 0  
                and avg_fast < avg_slow 
                and rsi_1 < RSI_BUY 
                and rsi_1 < rsi_0 
                and rsi_2 > rsi_1)
        
    if  condition :        
        #calcolo quantità da comprare
        x = cap_unit/price
        
        print("Condition satisfied, try with: {}, notional {}".format(x,x*price))

        #verifica disponibilità 
        if bal_stable > cap_unit:
            order_succeeded = order(SIDE_BUY, x, asset + stable, 'LIMIT', price*1.0001)     
        else:
            order_succeeded = order(SIDE_BUY, bal_stable/price, asset + stable,'LIMIT', price*1.0001)

        if order_succeeded:
            print("Order confirmed...")
            wait_buy = True
            bnb_fees += x*price*0.00075

            if  not not_filled :                
                print("...and filled!")
                print("{} amount: {} bought at {} {} ".format(asset,temp_qty,temp_price,asset))
                get_balances()

                #calcolo nuovo prezzo medio di acquisto
                bal_asset_bought += temp_qty
                bought += temp_price*temp_qty

                #telegram log 
                telegram_send.send(messages=["New buy!\n{} amount: {} bought at {} {} ".format(asset,temp_qty,temp_price,asset)])
            else:
                print("...but not filled, wait next candle")
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
        #calcolo quantità da vendere
        x = bal_asset * PERC_TO_SELL
              
        print("Condition satisfied, try with: {}, notional {}".format(x,x*price))      

        #verifica disponibilità                             
        if bal_asset >= x and x*price > 10:
            order_succeeded = order(SIDE_SELL, x, asset + stable,'LIMIT', price*0.9999)      
        else:
            order_succeeded = order(SIDE_SELL, bal_asset, asset + stable,'LIMIT', price*0.9999)

        if order_succeeded:
            print("Order confirmed...")
            wait_sell = True
            bnb_fees += x*price*0.00075

            if  not not_filled :
            
                print("...and filled!")
                print("{} amount: {} sold at {} {}".format(asset,temp_qty,temp_price,stable))
                get_balances()

                #calcolo nuovo prezzo medio di acquisto
                bal_asset_sold += temp_qty
                sold += temp_price*temp_qty

                #reset buy
                bal_asset_bought = 0
                bought = 0

                #telegram log 
                telegram_send.send(messages=["New sell!\n{} amount: {} sold at {} {} ".format(asset,temp_qty,temp_price,stable)])
            else:
                print("...but not filled, wait next candle")
        else:
            print("WARNING, something goes wrong: order didn't succeed...")


def on_message(msg): 
    global closes, bal_stable, bal_asset, bal_asset_bought, bought, bal_asset_sold, sold, n_candle, not_filled, order_id, wait_nf_order, avg_buy_price, avg_sell_price
    global wait_buy, wait_sell, timer_buy, timer_sell
    global t_1, open_time
    global file_name, data_input
    from main import bal_stable_init, bsm
    current_time = int(msg['E'])

    #wait for candle closing
    if open_time == 0 :
        open_time = current_time

    #is candle closed?
    if current_time - open_time >= 60_000 :
        open_time = current_time
        t_1 = time.time()
        
        #load price and reserch of possible errors
        if msg['e'] != 'error' :
            close = float(msg['c'])
            print("Candle {} closed at : {} {}".format(n_candle,close,stable))  
            closes.append(close)     
            n_candle +=1         
            error_occurs = False
        else:
            error_occurs = True
        
        #stop the WebSocket
        if t_1 - t_0 > TIMEOUT or error_occurs == True :
            print("timeout or error")
            bsm.stop()

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
            
            #START BOT TRADING
            if len(closes) > start_Buy:
                print("BOT is ready...")
                #calcolo medie mobili e stdev mobile
                avg_fast = float(numpy.mean(closes[-MoveAvg_FAST:]))
                avg_slow = float(numpy.mean(closes[-MoveAvg_SLOW:]))        
                dev = float(numpy.std(closes))

                #initial log
                print("---------- initial log ----------")
                str_close = str_log(close," close price ")
                str_rsi = str_log(round(rsi_2,2),"  rsi  ")
                str_asset = str_log(bal_asset," {} balance ".format(asset))
                str_stable = str_log(round(bal_stable,2)," {} balance ".format(stable))
                str_avg_buy = str_log(round(avg_buy_price,2)," avg buy price ")
                str_avg_sell = str_log(round(avg_sell_price,2)," avg sell price ")
                to_print = "| close price ||  rsi  || {} balance || {} balance || avg buy price || avg sell price |\n|{}||{}||{}||{}||{}||{}|\n--------------------".format(asset,stable,str_close,str_rsi,str_asset,str_stable,str_avg_buy,str_avg_sell)
                print(to_print)
            
                #catch not filled orders
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
                            #telegram log 
                            telegram_send.send(messages=["New buy!\nQuantity bought: {} at {}".format(order_nf['origQty'],order_nf['price'])])
                        if order_nf['side'] == "SELL":
                            #calcolo nuovo prezzo medio di acquisto
                            bal_asset_sold += float(order_nf['origQty'])
                            sold += float(order_nf['price'])*float(order_nf['origQty'])
                            #reset buy
                            bal_asset_bought = 0
                            bought = 0
                            print("Quantity sold: {} at {}".format(order_nf['origQty'],order_nf['price']))
                            #telegram log 
                            telegram_send.send(messages=["New buy!\nQuantity sold: {} at {}".format(order_nf['origQty'],order_nf['price'])])
                    else:
                        wait_nf_order +=1

                #cancel not filled order
                if wait_nf_order > 3:
                    cancel_order = client.cancel_order(symbol= asset + stable, orderId = order_id)
                    
                    if cancel_order['status'] == "CANCELED":
                        print("Order id {}, has been canceled!".format(order_id))
                        wait_nf_order = 0
                        not_filled = False
                    else:
                        print("unable to cancel the order id {}".format(order_id))
 

                #calcolo del prezzo di acquisto medio
                if bal_asset_bought > 0:
                    avg_buy_price = bought/bal_asset_bought
                    
                    #save avg prices
                    data_input['AVG_BUY_PRICE'] = avg_buy_price
                    data_input['BAL_ASSET_BOUGHT'] = bal_asset_bought
                    f = open(file_name,'w')
                    json.dump(data_input,f)
                    f.close()

                #calcolo del prezzo di vendita medio
                if bal_asset_sold > 0:
                    avg_sell_price = sold/bal_asset_sold

                    #save avg prices
                    data_input['AVG_SELL_PRICE'] = avg_sell_price
                    f = open(file_name,'w')
                    json.dump(data_input,f)
                    f.close()

                
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

                get_balances()
                
                #BUY                     
                buy(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2)
                
                #SELL                                         
                sell(price=close, avg_fast=avg_fast, avg_slow=avg_slow, rsi_0=rsi_0, rsi_1=rsi_1, rsi_2=rsi_2, avg_buy_price=avg_buy_price)
                
                #salva risultati    
                to_save = str(close) + " , " + str(rsi_2) + " , " + str(bal_asset) + " , " + str(bal_stable) + "\n"
                data = open("data_run/data_{}.txt".format(data_test_id),'a')
                data.write(to_save)
                data.close()
                
                #final log
                print("---------- final log ----------")
                str_close = str_log(close," close price ")
                str_rsi = str_log(round(rsi_2,2),"  rsi  ")
                str_asset = str_log(bal_asset," {} balance ".format(asset))
                str_stable = str_log(round(bal_stable,2)," {} balance ".format(stable))
                str_avg_buy = str_log(round(avg_buy_price,2)," avg buy price ")
                str_avg_sell = str_log(round(avg_sell_price,2)," avg sell price ")
                to_print = "| close price ||  rsi  || {} balance || {} balance || avg buy price || avg sell price |\n|{}||{}||{}||{}||{}||{}|\n--------------------\n".format(asset,stable,str_close,str_rsi,str_asset,str_stable,str_avg_buy,str_avg_sell)
                print(to_print)

                #telegram log
                if n_candle % 10 == 0:
                    telegram_to_print = "Close price: {}\nRSI: {}\n{} balance: {}\n{} balance: {}\nAvg buy price: {}\nAvg sell price: {}".format(close,round(rsi_2,2),asset,bal_asset,stable,round(bal_stable,2),round(avg_buy_price,2),round(avg_sell_price,2))
                    telegram_send.send(messages=[telegram_to_print])


                


#start WebSocket
def start_WS():
    bsm = ThreadedWebsocketManager()
    bsm.start()
    bsm.start_symbol_ticker_socket(callback=on_message, symbol= asset + stable)
    return bsm