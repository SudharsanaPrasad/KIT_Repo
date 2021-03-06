"""katrinconsole URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="KATRIN Console API",
        default_version='v1',
        description="KATRIN Console APIs",
        contact=openapi.Contact(email="jalal.mostafa@kit.edu"),
    ),
    public=False,
    # permission_classes=(permissions.IsAuthenticated,),
)

admin.autodiscover()


def home(request):
    return render(request, 'index.html')


urlpatterns = [
    # server side routing including API endpoints
    path('admin/', admin.site.urls),
    path('accounts/', include('rest_framework.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/', include([
        path('swagger/', schema_view.with_ui('swagger',
                                             cache_timeout=0), name='schema-swagger-ui'),
        # APPLICATIONS HERE: add your application urls BELOW this line
        path('', include('katrinconsole.core.urls')),
        # APPLICATIONS END: add your application urls ABOVE this line
    ])),
    # map to client side routing
    re_path(r'^.*$', home),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
