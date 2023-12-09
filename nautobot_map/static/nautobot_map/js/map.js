/** global ol */

const map_div = document.getElementById('map')
const geoJson = map_div.dataset.geojson

const location_layer = new ol.layer.Vector({
    title: 'Locations',
    source: new ol.source.Vector({
        url: 'data:,' + encodeURIComponent(geoJson),
        format: new ol.format.GeoJSON()
    }),
})

const map = new ol.Map({
    target: map_div,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
        location_layer
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

var once = false
map.addEventListener('loadend', function (evt) {
    if (once) {return}
    map.getView().fit(location_layer.getSource().getExtent())    
    once = true
})
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


