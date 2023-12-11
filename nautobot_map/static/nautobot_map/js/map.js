/** global ol */

const map_div = document.getElementById('map')
const features = JSON.parse(map_div.dataset.geojson)
// console.log(groups)

// const location_layer = new ol.layer.Vector({
//     title: 'Locations',
//     source: new ol.source.Vector({
//         url: 'data:,' + encodeURIComponent(geoJson),
//         format: new ol.format.GeoJSON()
//     }),
// })

const map = new ol.Map({
    target: map_div,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
        // location_layer
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

ol.proj.useGeographic()

const layers = {}
const coords = []
for (f of features) {
    console.log(f)
    if (!layers[f.location_type__name]) {
        let l = new ol.layer.Vector({
            title: f.location_type__name,
            source: new ol.source.Vector({})
        })
        map.addLayer(l)
        layers[f.location_type__name] = l
    }
    let coord = [1*f.longitude, 1*f.latitude]
    coords.push(coord)
    var point = new ol.geom.Point(coord)
    var feature = new ol.Feature({
        name: f.name,
        geometry: point,
        type: f.location_type__name,
        status: f.status__name,
        description: f.description,
        facility: f.fa,
        tenant: f.tenant__name,
        facility: f.facility,
        asn: f.asn,
        physical_address: f.physical_address,
        contact_name: f.contact_name,
        contact_email: f.contact_email,
        comments: f.comments,
        ...f._custom_field_data        
    })
    const source = layers[f.location_type__name].getSource() 
    source.addFeature(feature)
}

map.getView().fit(ol.extent.buffer(ol.extent.boundingExtent(coords), 0.5))    

/**
 * Popup
 **/
var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});
map.addOverlay(overlay);

var fullscreen = new ol.control.FullScreen();
map.addControl(fullscreen);

map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            return feature;
        });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();

        var content = '<h3>' + feature.get('name') + '</h3>';
        for (p in feature.getProperties()) {
            if (p == 'geometry' || p == 'name') {continue}
            content += `<strong>${p}: </strong>${feature.get(p) || ''}<br>`;
        }

        content_element.innerHTML = content;
        overlay.setPosition(coord);
    }
});
map.on('pointermove', function (e) {
    if (e.dragging) return;

    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

var layerSwitcher = new ol.control.LayerSwitcher({
    // tipLabel: 'Légende', // Optional label for button
    // groupSelectStyle: 'none' // Can be 'children' [default], 'group' or 'none'
  });
map.addControl(layerSwitcher);
