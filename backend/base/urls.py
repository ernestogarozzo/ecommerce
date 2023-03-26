
from django.urls import path
from . import views

urlpatterns = [
    path('/',                        views.getRoutes , name='routes'),
    
    path('users/profile/',              views.getUserProfile , name='users-profile'),

    path('products',                 views.getProducts , name='products'),
    path('products/<str:pk>/',        views.getProduct , name='product'),
    path('user/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('model/',        views.getModelResult , name='model'),

    path('tradingAllData/', views.getAllBotData , name='AllBotData'),
    path('tradingStart/', views.startBot, name='StartBot'),
    path('tradingWalletInfo/', views.getWalletInfo, name='WalletInfo')
    ]
