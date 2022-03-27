const map = L.map('map').setView([39.77, -96.94], 4.5);
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
  fetch(url)
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
  fetch(url)
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

let updatePopUp = (parksToShow) => {
  parkLayer.clearLayers();
  L.geoJSON(parksToShow, {
    style: feature => {
      let type = feature.properties.UNIT_TYPE;
      return { color: parkColors[type] };
    },
  })
  .addTo(parkLayer)
  .bindPopup(layer => {
      let nam = layer.feature.properties.UNIT_NAME;
      return `${nam}`;
  })
  .openPopup();
}

let slideIndex = 0;

let updateSlides = () => {
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
    
    
    let oldIndex;
    if (oldIndex !== slideIndex) {
      if (slideIndex === 0 ) {
        let parksToShow = parkList;
        updateParkMarkers(parksToShow);
      };
      if (slideIndex < 4 && slideIndex > 0) {
        let typeValue = 'National Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_TYPE === typeValue);
        updateParkMarkers(parksToShow);
        map.flyTo([39.77, -96.94], 4.5);
      };
      if (slideIndex === 4) {
        let nameValue = 'Independence National Historical Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
        updateParkMarkers(parksToShow);
        updatePopUp(parksToShow);
        map.flyTo([39.95, -75.1327], 12);
      };      
      if (slideIndex === 5) {
        let nameValue = 'Great Smoky Mountains National Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
        updateParkMarkers(parksToShow);
        updatePopUp(parksToShow);
        map.flyTo([35.61, -83.50], 10);
      };
      if (slideIndex === 6) {
        let nameValue = 'Zion National Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
        updateParkMarkers(parksToShow);
        updatePopUp(parksToShow);
        map.flyTo([37.296, -113.02], 10);
      };
      if (slideIndex === 7) {
        let nameValue = 'Yellowstone National Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
        updateParkMarkers(parksToShow);
        updatePopUp(parksToShow);
        map.flyTo([44.686, -110.58], 8);
      };
      if (slideIndex === 8) {
        let nameValue = 'Grand Canyon National Park';
        let parksToShow = parkList.features.filter((park) => park.properties.UNIT_NAME === nameValue);
        updateParkMarkers(parksToShow);
        updatePopUp(parksToShow);
        map.flyTo([36.19, -112.23], 8);
      };

      oldIndex = slideIndex;
    }

  })

}

// bar chart
anychart.onDocumentReady(function() {
 
  // set the data
  var data = {
      header: ["Year", "Visitors"],
      rows: [
        ["2021", 297115406],
        ["2020", 237064332],
        ["2019", 327516619],
        ["2018", 318211833],
        ["2017", 330882751],
        ["2016", 330971689],
        ["2015", 307247252],
        ["2014", 292800082],
        ["2013", 273630895],
        ["2012", 282765682],
  ]};

  // create the chart
  var chart = anychart.bar();

  // add the data
  chart.data(data);

  // set the chart title
  chart.title("NPS Visitors by Year");

  // draw
  chart.container("chart-container");
  chart.draw();
});

// initialization steps for the web page.
let allParks;
let url2 = './nps.geojson'
let url = 'https://opendata.arcgis.com/datasets/c8d60ffcbf5c4030a17762fe10e81c6a_2.geojson';
getData(url, (data) => allParks = data)

initializeTypeChoice();
initializeStateChoice();

updateSlides();

const parkColors = {
  'National Historical Park': '#fd8d3c',
  'Other Designation': '#f16913',
  'National Battlefield Site': '#dadaeb',
  'National Historic Site': '#bcbddc',
  'National Park': '#EF7C8E',
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