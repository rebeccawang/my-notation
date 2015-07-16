import json

from django.shortcuts import render
from django.views.generic import DetailView, View
from django.views.generic.list import ListView
from django.views.generic.edit import (CreateView, UpdateView, DeleteView)
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import FormMixin
from django.http import Http404, HttpResponse

from .models import Design, Pin
from .forms import DesignForm, PinForm, DesignUpdateForm


class DesignCreateView(CreateView):
    model = Design
    form_class = DesignForm

    def get_initial(self):
        self.initial.update({'user': self.request.user})
        return self.initial

    def get_success_url(self):
        return '/design/%d/update/' % self.object.pk

create = login_required(DesignCreateView.as_view())


class DesignDeleteView(DeleteView):
    model = Design

    def get_success_url(self):
        return '/design/'

delete = login_required(DesignDeleteView.as_view())


class DesignUpdateView(UpdateView):
    model = Design
    form_class = DesignUpdateForm
    template_name = 'design/design_update.html'

    def get_context_data(self, *args, **kwargs):
        context = super(DesignUpdateView, self).get_context_data(
            *args, **kwargs)
        # form
        initial = {
            'user': self.request.user,
            'design': self.object,
        }
        context.update(
            {'pin_form': PinForm(initial=initial)}
        )
        # exists pins
        pins = {'markers': []}
        for pin in self.object.pin_set.all():
            pins['markers'].append({
                'id': pin.pk,
                'title': pin.category,
                'xcoord': pin.x,
                'ycoord': pin.y,
            })

        context.update(
            {'pins': json.dumps(pins)}
        )
        return context


update = login_required(DesignUpdateView.as_view())


class DesignView(DetailView):
    model = Design

    def get_context_data(self, *args, **kwargs):
        context = super(DesignView, self).get_context_data(*args, **kwargs)
        # form
        initial = {
            'user': self.request.user,
            'design': self.object,
        }
        context.update(
            {'pin_form': PinForm(initial=initial)}
        )
        # exists pins
        pins = {'markers': []}
        i = 1
        for pin in self.object.pin_set.all():
            pins['markers'].append({
                'id': pin.pk,
                'number': i,
                'title': pin.category,
                'xcoord': pin.x,
                'ycoord': pin.y,
            })
            i += 1

        context.update(
            {'pins': json.dumps(pins)}
        )
        return context

    def get(self, *args, **kwargs):
        if self.request.is_ajax():
            super(DesignView, self).get(self, *args, **kwargs)
            return HttpResponse(self.get_context_data()['pins'])
        else:
            return super(DesignView, self).get(self, *args, **kwargs)

view = login_required(DesignView.as_view())


class PinCreateView(CreateView):
    model = Pin
    form_class = PinForm
    design = None

    def get_design(self, *args, **kwargs):
        if self.design is None:
            try:
                pk = int(self.request.GET.get('d'))
            except TypeError:
                raise Http404
            try:
                self.design = Design.objects.get(pk=pk)
            except Design.DoesNotExist:
                raise Http404

        return self.design

    def get_initial(self):
        initial = {
            'user': self.request.user,
            'design': self.get_design(),
        }
        self.initial.update(initial)
        return self.initial

    def get_success_url(self):
        return self.get_design().get_absolute_url()

create_pin = login_required(PinCreateView.as_view())


class DesignHome(ListView):
    model = Design

    def get_queryset(self, *args, **kwargs):
        return Design.objects.filter(user=self.request.user)

my = login_required(DesignHome.as_view())


class DesignList(ListView):
    model = Design

    def get_queryset(self, *args, **kwargs):
        return Design.objects.filter()

li = login_required(DesignList.as_view())


class PinDetail(DetailView):
    model = Pin

pin = login_required(PinDetail.as_view())
