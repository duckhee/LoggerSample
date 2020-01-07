 mapboxgl.accessToken = 'pk.eyJ1IjoiZG91Y2toZWUiLCJhIjoiY2sydHFqbGhlMWU3MjNvbnZwMXRyYm5iaSJ9.AcPTDkYnboPF0NgLLQ_sIw';
 mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');

 function mapMaker() {
     let map = new mapboxgl.Map({
         container: 'Map',
         center: [127.561236, 36.986204], //seoul
         style: 'mapbox://styles/mapbox/satellite-streets-v9',
         zoom: 10
     });
     let mapZoomCtrl = new mapboxgl.NavigationControl();
     map.addControl(new MapboxLanguage({
         defaultLanguage: 'ko'
     }));
     map.addControl(mapZoomCtrl, 'bottom-right');
     return map;

 }

 function Reloading(map) {
     $(document).on('click', "[data-toggle='offcanvas']", function(e) {
         e.preventDefault();

         map.resize();
     });
 }

 function makeMaker(map, lat, lon, popUp) {
     console.log(popUp);
     let mapPopup = "<div class='map-popup'>" +
         "<div class='map-box'>" +
         "<h5>" + popUp.name + "</h5>" +
         "<div class='map-box-content'>" +
         "<h6>" + popUp.DeviceType + "</h6>";
     popup = new mapboxgl.Popup({ offset: 25, anchor: 'bottom' })
         .setMaxWidth("600px")
         .setHTML(mapPopup);
     marker = new mapboxgl.Marker({
             draggable: false
         })
         .setLngLat([lon, lat])
         .setPopup(popup)
         .addTo(map);
     return popup;
 }

 function PopUpMarker(map, popup, name, lat, lon) {
     $("#" + name).click(function() {

         console.log("name", name);
         console.log("Lat : ", lat);
         console.log("Lon : ", lon);
         let deviceInfo = { lng: parseFloat(lon), lat: parseFloat(lat) };
         let px = map.project(deviceInfo);
         px.y -= deviceInfo.lat + 50;
         map.panTo(map.unproject(px), { animate: true });
         popup.addTo(map);
     });
 }