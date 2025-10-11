// Sayfa tamamen yüklendiğinde haritayı oluştur
window.onload = function() {
    // Haritanın altlık katmanı (OpenStreetMap'ten alıyoruz)
    const mapLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // Haritanın görünümü (merkez, zoom seviyesi)
    const mapView = new ol.View({
        // Koordinatlar: Ankara (Google Maps'ten alınabilir)
        // Koordinatların 'EPSG:3857' projeksiyon sisteminde olması gerekir.
        center: ol.proj.fromLonLat([32.8597, 39.9334]),
        zoom: 10 // Yakınlaştırma seviyesi
    });

    // Haritayı oluştur ve HTML'deki 'map' id'li div'e yerleştir
    const map = new ol.Map({
        target: 'map', // HTML'deki div'in id'si
        layers: [mapLayer],
        view: mapView
    });
};