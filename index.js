const map = L.map('map').setView([39.77, -96.94], 5);
const parkLayer = L.layerGroup().addTo(map);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png',
}).addTo(map);

//const schoolList = document.querySelector('#school-list');
const typeSelect = document.querySelector('#type-select');
const stateSelect = document.querySelector('#state-select');

/*
fetch('https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson')
  .then(resp => resp.json())
  .then(data => {
    L.geoJSON(data)
    .bindTooltip(layer => {
        let nam = layer.feature.properties.UNIT_NAME;
        return `Park Name: ${nam}`;
      })
    .addTo(map);
  });

*/

let getData = (url, cb) => {
  fetch(url)
  .then(response => response.json())
  .then(result => cb(result));
}

let initializeStateChoice = () => {
  fetch('https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson')
  .then(response => response.json())
  .then(result => {
    let state_list = [];
    result.features.forEach((park) => {
      let park_state = park.properties.STATE;
      state_list = state_list.concat(park_state);
    });
    let stateUnique = [...new Set(state_list)].sort();
    stateUnique.forEach((state) => {
      stateSelect.appendChild(htmlToElement(`<option>${state}</option>`));
    });
    console.log('State list set up!');
  });
};

let initializeTypeChoice = () => {
  fetch('https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson')
  .then(response => response.json())
  .then(result => {
    let type_list = [];
    result.features.forEach((park) => {
      const park_type = park.properties.UNIT_TYPE;
      type_list = type_list.concat(park_type);
      //console.log(park_type);
    });
    //console.log(type_list);

    let typeUnique = [...new Set(type_list)].sort();
    typeUnique.forEach((type) => {
      typeSelect.appendChild(htmlToElement(`<option>${type}</option>`));
    });
    console.log('Type list set up!');
  });
};


let filteredParks = () => {
  let typeValue = typeSelect.selectedOptions[0].label;;
  let stateValue = stateSelect.selectedOptions[0].label;;
  console.log('NEW SELECTION:', typeValue, stateValue);
  let parksToShow = parkList;
  if (stateValue !== 'All') {
    parksToShow = parksToShow.features.filter((park) => park.properties.STATE === stateValue);
    console.log('STATE SELECTED');
  } else {
    parksToShow = parksToShow.features;
    console.log('ALL STATES.')
  }
  if (typeValue !== 'All') {
    parksToShow = parksToShow.filter((park) => park.properties.UNIT_TYPE === typeValue);
    console.log('TYPE SELECTED');
  };

  //parksToShow = parkList.features.filter((park) => park.properties.STATE === stateValue).filter((park) => park.properties.UNIT_TYPE === typeValue);

  parksToShow.forEach((park) => {
    console.log(park.properties.UNIT_NAME);
  });
  return parksToShow;
};


let updateParkMarkers = (parksToShow) => {
  parkLayer.clearLayers();
  L.geoJSON(parksToShow)
  .bindTooltip(layer => {
      let nam = layer.feature.properties.UNIT_NAME;
      return `${nam}`;
    })
  .addTo(parkLayer);
};


// the main session of the script
let handleSelectChange = () => {
    const parksToShow = filteredParks() || [];
    updateParkMarkers(parksToShow);
    //updateParkList(parksToShow);
  };


typeSelect.addEventListener('change', handleSelectChange);
stateSelect.addEventListener('change', handleSelectChange);
  

// initialization steps for the web page.
let allParks;
let url = 'https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson';
getData(url, (data) => allParks = data)

initializeTypeChoice();
initializeStateChoice();
