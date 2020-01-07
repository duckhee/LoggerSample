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

     let mapPopup = '';

     popup = new mapboxgl.Popup({ offset: 25, anchor: 'bottom' })
         .setMaxWidth("600px")
         .setHTML(mapPopup);
     /*
          marker = new mapboxgl.Marker({
                  draggable: false
              })
              .setLngLat([126.8124566, 33.542319])
              .setPopup(popup)
              .addTo(map);
     */

     return map;

 }

 function Reloading(map) {
     $(document).on('click', "[data-toggle='offcanvas']", function(e) {
         e.preventDefault();

         map.resize();
     });
 }