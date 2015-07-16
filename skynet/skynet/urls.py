from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', 'design.views.li'),
    url(r'^design/', include('design.urls')),
    url(r'^accounts/', include('allauth.urls')),
    # url(r'^comments/', include('django.contrib.comments.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(
    settings.CACHE_MEDIA, document_root=settings.CACHE_MEDIA_ROOT)
