// Bu sarmalayıcı, tüm HTML sayfası yüklendikten sonra kodun çalışmasını sağlar.
window.addEventListener('DOMContentLoaded', (event) => {

    // Gerekli OpenLayers modüllerini import et
    const { Map, View, Feature, Overlay } = ol;
    const { Tile: TileLayer, Vector: VectorLayer } = ol.layer;
    const { OSM, Vector: VectorSource } = ol.source;
    const { fromLonLat } = ol.proj;
    const { Point } = ol.geom;
    const { Style, Icon } = ol.style;

    // --- HASSAS KONUMLARIMIZ ---
    const ankara = fromLonLat([32.88325114089116, 39.939577650861324]);
    const kayseriStaj = fromLonLat([35.52301633579689, 38.28641131839441]);
    const adanaStaj = fromLonLat([35.65771021612759, 36.97985967967293]);

    // --- İKONLAR (Sade ve Tutarlı Hale Getirildi) ---
    // Ankara için sarı ikon
    const evIkonu = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-yellow.png',
            scale: 0.6
        })
    });

    // === DEĞİŞİKLİK BURADA: Stajlar için tek, sade bir gri ikon kullanıyoruz ===
    const isIkonu = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-grey.png',
            scale: 0.6 // Ankara ikonuyla aynı boyutta olması için
        })
    });

    // --- NOKTALARI (FEATURE) OLUŞTURMA ---
    // Her noktaya görsel bilgisi ekli, ama ikonları sade tutuyoruz.
    const ankaraNoktasi = new Feature({
        geometry: new Point(ankara),
        name: 'Ev Konumum<br>Ankara'
    });
    ankaraNoktasi.setStyle(evIkonu);

    const kayseriNoktasi = new Feature({
        geometry: new Point(kayseriStaj),
        name: 'Öksüt Madencilik Stajı<br>Develi, Kayseri',
        imageSrc: 'images/oksut-staj.jpeg'
    });
    kayseriNoktasi.setStyle(isIkonu); // DEĞİŞTİ: Artık sade gri ikon kullanılıyor

    const adanaNoktasi = new Feature({
        geometry: new Point(adanaStaj),
        name: 'SNH İnşaat Stajı<br>Ceyhan, Adana',
        imageSrc: 'images/snh-staj.jpeg'
    });
    adanaNoktasi.setStyle(isIkonu); // DEĞİŞTİ: Artık sade gri ikon kullanılıyor

    // --- KATMAN OLUŞTURMA ---
    const vektorKaynagi = new VectorSource({
        features: [ankaraNoktasi, kayseriNoktasi, adanaNoktasi]
    });
    const vektorKatmani = new VectorLayer({ source: vektorKaynagi });
    
    // --- POPUP ELEMANLARINI SEÇME ---
    const popupContainer = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupCloser = document.getElementById('popup-closer');

    const popup = new Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });

    // --- HARİTAYI OLUŞTURMA ---
    const altlikHarita = new TileLayer({ source: new OSM() });
    const map = new Map({
        target: 'map',
        layers: [altlikHarita, vektorKatmani],
        overlays: [popup],
        view: new View({
            center: fromLonLat([34.8, 38.5]),
            zoom: 6.5
        })
    });

    // --- TIKLAMA OLAYI (Bu kısım zaten doğruydu) ---
    map.on('click', function(evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
        if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            const name = feature.get('name');
            const imageSrc = feature.get('imageSrc');
            
            let content = '';
            if (imageSrc) {
                content += `<img src="${imageSrc}" class="popup-image" alt="Staj Yeri Fotoğrafı">`;
            }
            content += `<p>${name}</p>`;

            popupContent.innerHTML = content;
            popup.setPosition(coordinates);
        } else {
            popup.setPosition(undefined);
            popupCloser.blur();
        }
    });

    popupCloser.onclick = function() {
        popup.setPosition(undefined);
        popupCloser.blur();
        return false;
    };
});