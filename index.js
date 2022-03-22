const map = L.map('map').setView([39.77, -96.94], 5);
const parkLayer = L.layerGroup().addTo(map);

/*
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png',
}).addTo(map);
*/

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//const schoolList = document.querySelector('#school-list');
const typeSelect = document.querySelector('#type-select');
const stateSelect = document.querySelector('#state-select');

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
  L.geoJSON(parksToShow, {
    style: feature => {
      let type = feature.properties.UNIT_TYPE;
      return { color: parkColors[type] };
    },
  })
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


let slideIndex = 0;
let getSlideIndex = () => {
  document.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight;
    const slideDivs = document.getElementsByClassName('slide');
    //console.log(`The current scroll position is ${scrollPos}.`);
  
    
    for (slideIndex = 0; slideIndex < slideDivs.length; slideIndex++) {
      const slideDiv = slideDivs[slideIndex];
      const slidePos = slideDiv.offsetTop;
      //console.log(`The position of slide ${slideIndex} is ${slidePos}.`);
      if (slidePos > scrollPos) {
        slideIndex--;
        break;
      }
    }
    console.log(`The current slide is ${slideIndex}.`);

    if (slideIndex === 0 ) {
      let parksToShow = parkList;
      updateParkMarkers(parksToShow);
    };
    if (slideIndex < 6 && slideIndex > 0) {
      let typeValue = 'National Park';
      let parksToShow = parkList.features.filter((park) => park.properties.UNIT_TYPE === typeValue);
      updateParkMarkers(parksToShow);
      map.flyTo([39.77, -96.94], 5);
    };
    if (slideIndex === 6) {
      let nameValue = 'Grand Canyon National Park';
      let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
      updateParkMarkers(parksToShow);
      map.flyTo([36.19, -112.23], 8);
    };


  })

}

// initialization steps for the web page.
let allParks;
let url = 'https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson';
getData(url, (data) => allParks = data)

initializeTypeChoice();
initializeStateChoice();

getSlideIndex();

const parkColors = {
  'National Historical Park': '#fd8d3c',
  'Other Designation': '#f16913',
  'National Battlefield Site': '#dadaeb',
  'National Historic Site': '#bcbddc',
  'National Park': '#9e9ac8',
  'National Monument': '#807dba',
  'National Memorial': '#6a51a3',
  'National Recreation Area': '#54278f',
  'International Historic Site': '#3f007d',
  'National Scenic Riverway': '#7f2704',
  'National Seashore': '#bdd7e7',
  'National Preserve': '#6baed6',
  'National Battlefield Park': '#3182bd',
  'National Battlefield': '#08519c',
  'Park': '#d94801',
  'National Lakeshore': '#a63603',
  'National River and Recreation Area': '#fcbba1',
  'Wild and Scenic River': '#fc9272',
  "National Scenic River": '#fb6a4a',
  'National Parkway': '#ef3b2c',
  'National Reserve': '#cb181d',
  'National Historic Trail': '#66c2a4',
  'Parkway': '#238b45',
  'National Scenic Trail': '#67000d',
  'Scenic and Recreational River': '#00441b',
  'National Military Park': '#BDC667',
  'Memorial': '#77966D',
  'National Monument and Historic Shrine': '#626D58',
  'National Recreation River': '#F991CC',
  "National River": '#305252',
  'Wild River': '#9ED0E6',
  'Ecological and Historic Preserve': '#D6EFFF',
  'National Historical Reserve': '#FED18C',
  'National Park and Preserve': '#FED99B',
};

const visitorRank = {
  "Great Smoky Mountains National Park": 14.1,
  "Zion National Park": 5,
  "Yellowstone National Park ": 4.9,
  "Grand Canyon National Park": 4.5,
  "Rocky Mountain National Park": 4.4,
}