from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product, BotData, BotParams
from .serializers import ProductSerializer, UserSerializer, BotChartDataSerializer, BotTradingDataSerializer, BotParamsSerializer
from .stablediffusion import aiModel

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .bot import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        data = super().validate(attrs)

        data['username'] = self.user.username
        data['email'] = self.user.email

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




### BOT ###
#get all bot data by timestamp -> idParams (params, chart, trading)
@api_view(['GET'])
def getAllBotData(request):

    timestamp = int(request.GET.get('timestamp'))

    try:
        botParams = BotParams.objects.get(timestamp=timestamp)
        botData = BotData.objects.filter(idParams=botParams._id)
    
        serializerChartData = BotChartDataSerializer(botData, many=True)
        serializerTradingData = BotTradingDataSerializer(botData, many=True)
        serializerParams = BotParamsSerializer(botParams, many=False)

        response = Response({
            "anyData": 1,
            "chartData": serializerChartData.data, 
            "tradingData": serializerTradingData.data, 
            "params": serializerParams.data,
            "timestamp": timestamp,
        })
    except (BotParams.DoesNotExist, BotData.DoesNotExist):
        response = Response({
            "anyData": 0,
            "chartData": {}, 
            "tradingData": {}, 
            "params": {},
            "timestamp": '',
        })


    return response

#bot-start
@api_view(['GET'])
def startBot(request):
    asset = request.GET.get('asset')
    stable = request.GET.get('stable')
    timeframe = request.GET.get('timeframe')
    rsiBuy = request.GET.get('rsiBuy')
    rsiSell = request.GET.get('rsiSell')
    moveAvgFast = request.GET.get('moveAvgFast')
    moveAvgSlow = request.GET.get('moveAvgSlow')
    marginSell = request.GET.get('marginSell') 
    percToSell = request.GET.get('percToSell')
    timestamp = request.GET.get('timestamp')
    print("Bot online...")

    main(
        asset,
        stable, 
        timeframe, 
        rsiBuy, 
        rsiSell, 
        moveAvgFast, 
        moveAvgSlow, 
        marginSell, 
        percToSell,
        timestamp
    )          

    # returning JSON response
    return Response({"state":"end"})

#bot-wallet-info
@api_view(['GET'])
def getWalletInfo(request):
    apiKey =  request.GET.get('apiKey')
    secretKey =  request.GET.get('secretKey')

    wallet = walletInfo(apiKey, secretKey)           
    
    # returning JSON response
    return Response(wallet)





### AI-MODEL ###
#ai model
@api_view(['GET'])
def getModelResult(request):
    text =  request.GET.get('text')

    # predict method used to get the prediction
    response = aiModel(text)
    
    # returning JSON response
    return Response(response)


###################


# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    return Response('Hello')


@api_view(['GET'])
def getUserProfile(request):
    user = request.user

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

