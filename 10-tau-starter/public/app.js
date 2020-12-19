const map = L.map('map').fitWorld();

//add map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '<a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.setZoom(12);
map.panTo(new L.LatLng(32.070953, 34.763514));


// When set to true, the next map click will trigger dialog open for pin placement:
let pinInPlacement = false;
// Current pin coordinates, set by pressing the map
let currentPinCoords = null;
// when set to true navigate button is pressed and the view set to the your location
let isNavigate = false;

// Map press event
map.on('mousedown touchstart', function onMouseDown(event) {
  if (pinInPlacement) {
    currentPinCoords = event.latlng;
    pinInPlacement = false;
    dialog.showModal();
    const pinButton = document.getElementById('add-pin-button');
    pinButton.classList = 'mdc-fab';
  }
});

var markerType = null;

/*ICONS CONFIG*/
var benchIcon = L.icon({
  iconUrl: 'icons/bench-icon.png',
  iconSize: [60, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var toiletIcon = L.icon({
  iconUrl: 'icons/toilet-icon.png',
  iconSize: [60, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var workoutIcon = L.icon({
  iconUrl: 'icons/workout-icon.png',
  iconSize: [60, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});


/*END ICONS CONFIG*/

/*sending image*/
const handleImageUpload = event => {
  const files = event.target.files
  const formData = new FormData()
  formData.append('myFile', files[0])

  fetch('/add_img', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.path)
    })
    .catch(error => {
      console.error(error)
    })
}

document.querySelector('#fileUpload').addEventListener('change', event => {
  handleImageUpload(event)
})
/*end sending image*/

//button-change class
function updateClass(ele) {
  const element = ele;
  var divs = document.querySelectorAll("[ispressed]");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i] !== ele && divs[i].getAttribute('ispressed') === 'true') {
      divs[i].setAttribute('ispressed', false);
      divs[i].classList = '';
    }
  }
  console.log(element.getAttribute('ispressed'));
  if (element.getAttribute('ispressed') === 'false') {
    element.setAttribute('ispressed', true);
    element.classList.add('example-1');
    markerType = element.getAttribute('type');
  } else {
    element.setAttribute('ispressed', false);
    element.classList = '';
    markerType = null;
  }
}
// Bottom-right button press event
function addPin() {
  pinInPlacement = !pinInPlacement;

  const pinButton = document.getElementById('add-pin-button');
  if (pinInPlacement == true) {
    pinButton.classList.add('add-pin-button--active');
  } else {
    pinButton.classList = 'mdc-fab';
  }
}

// Register dialog
const dialog = document.querySelector('dialog');
if (!dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}

// Dialog save
dialog.querySelector('#dialog-rate_save').addEventListener('click', function () {
  if (markerType == null) {
    alert("please choose a Type to continue!");
    return;
  }
  dialog.close();

  if (currentPinCoords) {
    const type = markerType;
    const description = document.querySelector('#description').value;
    const id = getRandomId();
    const data = { type, description, coords: currentPinCoords };

    if (markerType == "bench") {
      L.marker(currentPinCoords, { icon: benchIcon }).addTo(map).on('dblclick', onDoubleClick)
        .bindPopup(description);
    } else if (markerType == "toilet") {
      L.marker(currentPinCoords, { icon: toiletIcon }).addTo(map).on('dblclick', onDoubleClick)
        .bindPopup(description);
    } else { // workout
      L.marker(currentPinCoords, { icon: workoutIcon }).addTo(map).on('dblclick', onDoubleClick)
        .bindPopup(description);
    }

    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET'
    });fetch
    clearPressedType();
  }

  deactivateAddPinButton();
});

// Dialog close (without saving)
dialog.querySelector('.close').addEventListener('click', function () {
  dialog.close();
  deactivateAddPinButton();
  clearPressedType();
});

//cleans pressed button and markerType=null
function clearPressedType() {
  var divs = document.querySelectorAll("[ispressed]");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].getAttribute('ispressed') === 'true') {
      divs[i].setAttribute('ispressed', false);
      divs[i].classList = '';
    }
  }
  markerType = null;
}

// add icon to map


// Dialog helper method (i.e change button color)
function deactivateAddPinButton() {
  const pinButton = document.getElementById('add-pin-button');
  pinButton.classList.remove('a-pin-button--active');
}
/*aubaida adds*/

let locatedFlag = 0;
let radiusLocation = null;
let pointLocation = null;

function onLocationFound(e) {
  if (locatedFlag == 1) {
    map.removeLayer(pointLocation);
  }
  var radius = e.accuracy / 2;
  pointLocation = new L.marker(e.latlng);
  pointLocation.addTo(map)
    .on('dblclick', onDoubleClick)
    .bindPopup("You are here!")
  if (locatedFlag == 0) {
     stopLocation();
    locatedFlag = 1;
  }
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//first location
map.locate({ setView: true, maxZoom: 16, watch: true, enableHighAccuracy: true });


function locate(setView) {
  map.locate({ setView: setView, maxZoom: 16, watch: true, enableHighAccuracy: true });
}
function stopLocation() {
  map.stopLocate();
  locate(false);
}

function onDoubleClick(e) {
  alert(this.getLatLng());
}
/*aubaida end adding*/

// load map:
fetch('/all_points', { method: 'GET' })
  .then(result => result.json())
  .then(data => {
    Object.keys(data).forEach(
      id => {
        const pointData = JSON.parse(data[id]);
        var pointType = pointData.type;
        if (pointType == "bench") {
          L.marker(pointData.coords, { icon: benchIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        } else if (pointType == "toilet") {
          L.marker(pointData.coords, { icon: toiletIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        } else { // workout
          L.marker(pointData.coords, { icon: workoutIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        }
      }
    );
  }
  );

//navigate button 
function navigatetionMode(){
  isNavigate = !isNavigate;

  const navigateButton = document.getElementById('navigate-button');
  map.stopLocate();
  locate(isNavigate);
  if (isNavigate == true) {
    navigateButton.classList.add('navigate-button--active');
  } else {
    navigateButton.classList = 'mdc-fab';
  }
}
// Utils
function getRandomId() {
  return Math.random().toString().substr(2, 9);
};
