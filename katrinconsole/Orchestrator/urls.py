from django.urls import path
from . import views

urlpatterns = [ path('orchestrator/', views.main, name = 'main')]