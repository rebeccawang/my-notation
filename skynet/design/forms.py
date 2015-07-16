from django import forms
from .models import Design, Pin


class UserForm(object):

    userfield = 'user'

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(**kwargs)
        setattr(self, self.userfield, kwargs['initial'][self.userfield])

    def save(self, commit=True):
        obj = super(UserForm, self).save(False)
        setattr(obj, self.userfield, getattr(self, self.userfield))
        if commit:
            obj.save()
        # self.save_m2m()  # tags
        return obj


class DesignForm(UserForm, forms.ModelForm):

    class Meta:
        model = Design
        exclude = ('user', 'title', 'description')


class DesignUpdateForm(forms.ModelForm):

    class Meta:
        model = Design
        exclude = ('user', 'upload', )


class PinForm(UserForm, forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(PinForm, self).__init__(**kwargs)
        self.design = kwargs['initial']['design']

    def save(self, commit=True):
        obj = super(PinForm, self).save(False)
        obj.design = self.design
        print self.design
        if commit:
            obj.save()
        # self.save_m2m()  # tags
        return obj

    class Meta:
        model = Pin
        exclude = ('design', 'user')
