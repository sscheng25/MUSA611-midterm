const map = L.map('map').setView([39.77, -96.94], 5);
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png',
}).addTo(map);


let p1;
fetch('https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson')
  .then(resp => resp.json())
  .then(data => {
    p1 = L.geoJSON(data)
    .bindTooltip(layer => {
        let nam = layer.feature.properties.UNIT_NAME;
        return `Park Name: ${nam}`;
      })
    .addTo(map);
  });