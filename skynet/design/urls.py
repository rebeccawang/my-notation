from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'design.views',
    url(r'^$', 'li', name='list-design'),
    url(r'^my/$', 'my', name='my-design'),
    url(r'^create/$', 'create', name='create-design'),
    url(r'^(?P<pk>\d+)/$', 'view', name='view-design'),
    url(r'^(?P<pk>\d+)/delete/$', 'delete', name='delete-design'),
    url(r'^(?P<pk>\d+)/update/$', 'update', name='update-design'),
    url(r'^pin/create/$', 'create_pin', name='create-pin-design'),
    url(r'^pin/(?P<pk>\d+)$', 'pin', name='view-pin-design'),
)
