from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True,
                              default='/placeholder.png')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.address)
    
### BOT ###
#bot params model    
class BotParams(models.Model):
    
    assetPrecision = models.IntegerField(blank=True, null = True)
    rsiPeriod = models.IntegerField(blank=True, null = True)
    moveAvgFast = models.IntegerField(blank=True, null = True)
    moveAvgSlow = models.IntegerField(blank=True, null = True)
    rsiBuy = models.IntegerField(blank=True, null = True)
    rsiSell = models.IntegerField(blank=True, null = True)
    timeBuy = models.IntegerField(blank=True, null = True)
    timeSell = models.IntegerField(blank=True, null = True)

    marginSell = models.DecimalField(max_digits=8, decimal_places=3, blank=True)
    percToSell = models.DecimalField(max_digits=8, decimal_places=3, blank=True)

    capitalUnit = models.DecimalField(max_digits=8, decimal_places=3, blank=True)
    initBalStable = models.DecimalField(max_digits=8, decimal_places=3, blank=True)
    initBalAsset = models.DecimalField(max_digits=8, decimal_places=3, blank=True)
    
    asset = models.CharField(max_length=200, blank=True)
    stable = models.CharField(max_length=200, blank=True)

    timestamp = models.IntegerField(blank=True, null = True)
    
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self._id)
      
#bot data model    
class BotData(models.Model):

    avgFast = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    avgSlow = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    avgSellPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    avgBuyPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    balanceStable = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    balanceAsset = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    balanceAssetBought = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    balanceAssetSold = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    sold = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    bought = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    
    rsiTwo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rsiOne = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rsiZero = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)    

    openTime = models.DecimalField(max_digits=16, decimal_places=0, null=True, blank=True)
    closeTime = models.DecimalField(max_digits=16, decimal_places=0, null=True, blank=True)

    open = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    high = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    low = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    close = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    volume = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)   

    idParams = models.ForeignKey(BotParams, on_delete=models.SET_NULL, null=True)    
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self._id)
