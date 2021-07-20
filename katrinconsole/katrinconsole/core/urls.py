from django.urls import path
from django.urls.conf import include
from .views import users, bora, sanity, control, dashboard

urlpatterns = [
    path('users/me',
         users.MeViewSet.as_view({'get': 'me', 'patch': 'change_password', })),
    path('boras/', bora.BoraView.as_view()),
    path('control/', include([
        path('migrator/', control.LegacyControlView.as_view()),
    ])),
    path('sanity/', include([
        path('groups/', sanity.GroupsView.as_view()),
        path('channels/', sanity.ChannelsView.as_view()),
        path('duplicates/', sanity.duplicates),
    ])),
    path('dashboard/', dashboard.DashboardView.as_view())
]
