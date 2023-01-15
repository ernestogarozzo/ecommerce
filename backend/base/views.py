from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .products import products
from .models import Product
from .serializers import ProductSerializer, UserSerializer

from .stablediffusion import aiModel

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        data = super().validate(attrs)

        data['username'] = self.user.username
        data['email'] = self.user.email

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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

#ai model
@api_view(['GET'])
def getModelResult(request):
    text =  request.GET.get('text')
            
    # predict method used to get the prediction
    response = aiModel(text)
    
    # returning JSON response
    return Response(response)
