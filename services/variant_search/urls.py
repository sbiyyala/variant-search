from django.urls import path

from . import views

urlpatterns = [
    path('suggest/', views.suggest, name='variant suggest'),
    path('search/', views.search, name='variant search'),
]
