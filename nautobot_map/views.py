""" View with a map """
import json

from django.views.generic import View
# from django.http import HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
# from django.db import connection

from nautobot.dcim.models import Location

# from django.core.exceptions import BadRequest

class MapView(LoginRequiredMixin, View):
    """ View the Locations' Map """

    def get(self, request):
        """ Pass all locations to the template and render it """

        locations = Location.objects.exclude(latitude=None).exclude(longitude=None).values(
            'name',
            'latitude',
            'longitude',
            'location_type__name',
            'status__name',
            'tenant__name',
            'description',
            'facility',
            'asn',
            'physical_address',
            'contact_name',
            'contact_email',
            'comments',
            '_custom_field_data',
        ).order_by('location_type__name')

        loc = json.dumps(list(locations), cls=DjangoJSONEncoder)
        return render(request, "nautobot_map/map.html", {'data': loc})
