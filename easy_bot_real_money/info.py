from binance.client import Client
from binance.enums import *
import pprint

#Setup client 
client = Client("QRpN4YS9Qf1IKNPUVnv4tU1N4keem734SOTsdgLjoVDIwp3OfiJpzeA6Gs8XL3mR", "wEKqJfXsyK1H9NXxUQEBMXMR2EXCifvNDQ0yBhEHoF5bebIGUb1jEcTZMMdJwx93")
#client.API_URL = 'https://api.binance.com'

#Print wallet balance
wallet = client.get_account()
balances = wallet['balances']

for i in range(len(balances)):
    if float(balances[i]['free']) > 0:
        pprint.pprint(balances[i])

info = client.get_symbol_info('ETHUSDT')
pprint.pprint(info)


