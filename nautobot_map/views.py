""" View with a map """

from django.views.generic import View
# from django.http import HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render

from nautobot.dcim.models import Location

import json

# from django.core.exceptions import BadRequest

# from .models import Attachment


def featureByLocation(loc):
    if loc.latitude is None or loc.longitude is None:
        return None
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(loc.longitude), float(loc.latitude)],
        },
        "properties": {
            'name': loc.name,
            'parent': loc.parent.name if loc.parent is not None else None,
            'type': loc.location_type.name,
            'status': loc.status.name,
            'tenant': loc.tenant.name if loc.tenant is not None else None,
            'description': loc.description,
            'facility': loc.facility,
            'asn': loc.asn,
            'physical_address': loc.physical_address,
            'contact_name': loc.contact_name,
            'contact_phone': loc.contact_phone,
            'contact_email': loc.contact_email,
            'comments': loc.comments,
            **loc.cf
        }
    }

class MapView(LoginRequiredMixin, View):
    """ View the Locations' Map """

    def get(self, request):
        """ Pass all locations to the template and render it """

        locations = Location.objects.all()
        features = []
        for l in locations:
            feature = featureByLocation(l)
            if feature is not None:
                features.append(feature)

        context = {
            "count": locations.count(),
            "geoJson": json.dumps({
                "type": "FeatureCollection",
                "features": features
            })
        }
        return render(request, "nautobot_map/map.html", context)
        # return HttpResponse(f"Hello, World! {locations.count()}")
