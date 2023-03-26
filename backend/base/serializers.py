from rest_framework import serializers 

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, BotData, BotParams

### BOT ###

# chartData: all live chart data
class BotChartDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotData
        fields = ['open','high','low','close','volume','openTime']

# params: all init bot params (from frontend + default)
class BotParamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotParams
        fields = '__all__'

# tradingtData: all live trading data
class BotTradingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotData
        fields = ['_id','idParams','rsiZero','rsiOne','rsiTwo','closeTime','sold','bought','balanceAssetBought','balanceAssetSold','avgSellPrice','avgBuyPrice','balanceStable','balanceAsset','avgFast','avgSlow']





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'isAdmin', '_id', 'username', 'email', 'name']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return(name)

    def get__id(self, obj):      
        return(obj.id)


class UserSerializerWithToken(UserSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'isAdmin', '_id', 'username', 'email', 'name', 'token']

    def get_tokend(self, obj):      
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

