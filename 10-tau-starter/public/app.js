const map = L.map('map').fitWorld();


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
let markers =[];
// when set to true navigate button is pressed and the view set to the your location
let isNavigate = false;

// Map press event
map.on('mousedown touchstart', function onMouseDown(event) {
  registerDialog(true);
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
var currImg="";

//try to load image 

 function encodeImageFileAsURL() {

    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        currImg= srcData;
        console.log(srcData);
       /* var newImage = document.createElement('img');
        newImage.src = srcData;

        document.getElementById("imgTest").innerHTML = newImage.outerHTML;
        alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
        console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);*/
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  }
/*end sending image*/

//button-change class
function updateClass(ele,multiple) {
  
  const element = ele;
  if(!multiple){
    var divs = document.querySelectorAll("[ispressed]");
    for (var i = 0; i < divs.length; i++) {
       if (divs[i] !== ele && divs[i].getAttribute('ispressed') === 'true') {
        divs[i].setAttribute('ispressed', false);
        divs[i].classList = '';
    }
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

function clearPointsFromMap(){
  console.log(markers);
  markers.forEach(function(m){
    map.removeLayer(m);
  });
  markers=[];
};

function showChosenFilters(){
  clearPointsFromMap();
  var divs = document.querySelectorAll("[ispressed]");
  
  var filterItems = [];
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].getAttribute('ispressed') === 'true'){
        filterItems.push(divs[i].getAttribute('type'));
      }
    }
    console.log(filterItems);
        fetch('/all_points', { method: 'GET' })
        .then(result => result.json())
        .then(data => {
        Object.keys(data).forEach(
        id => {
        const pointData = JSON.parse(data[id]);
        var pointType = pointData.type;
        var marker;
        if(filterItems.includes(pointType)){
        if (pointType == "bench") {
         marker = new L.marker(pointData.coords, { icon: benchIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        } else if (pointType == "toilet") {
         marker = new L.marker(pointData.coords, { icon: toiletIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        } else if(pointType == "workout") { // workout
         marker = new L.marker(pointData.coords, { icon: workoutIcon }).addTo(map).on('dblclick', onDoubleClick)
            .bindPopup(pointData.description);
        }
        markers.push(marker);
        }
      }
    );
  }
);
    
  dialog.close();
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

function showFilterOptions(){
    registerDialog(false);
    dialog.showModal();
    const filterButton = document.getElementById('choose-filter-button');
    filterButton.classList = 'mdc-fab';
  
}


//register dialog
var dialog;
function registerDialog(pinDialog){
var dialogs = document.querySelectorAll('dialog');
for (var i = 0; i < dialogs.length; i++) {
  if(pinDialog && dialogs[i].id==="add-pin-dialog"){
    dialog=dialogs[i];
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
      }
  }else if (!pinDialog  && dialogs[i].id==="filter-dialog"){
    dialog=dialogs[i];
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
  }
}
}





// Dialog save
function save(){
  if (markerType == null) {
    alert("please choose a Type to continue!");
    return;
  }
  dialog.close();

  if (currentPinCoords) {
    const type = markerType;
    const description = document.querySelector('#description').value;
    const id = getRandomId();
    const img = currImg;
    const data = { type, description, coords: currentPinCoords , img:img.toString('base64') };
    console.log(data);
    var marker;
    if (markerType == "bench") {
      marker = new L.marker(currentPinCoords, { icon: benchIcon }).addTo(map).on('dblclick', viewPhoto)
        .bindPopup(description);
    } else if (markerType == "toilet") {
      marker = new L.marker(currentPinCoords, { icon: toiletIcon }).addTo(map).on('dblclick', viewPhoto)
        .bindPopup(description);
    } else { // workout
     marker = new L.marker(currentPinCoords, { icon: workoutIcon }).addTo(map).on('dblclick', viewPhoto)
        .bindPopup(description);
    }
    markers.push(marker);
    var imgLength=document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive").length;
     var element= document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")[imgLength-1];
     element.setAttribute("id",id);
    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET',mode:'no-cors' //start here
    });fetch
    clearPressedType();
  }

  deactivateAddPinButton();
};

// Dialog close (without saving)
function closeDialog(){
  dialog.removeAttribute('open');
  if(dialog.id=='add-pin-dialog')
    deactivateAddPinButton();
  clearPressedType();
}

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
  currImg="";
  var uploadedFileName = document.querySelector('#inputFileToLoad');
  uploadedFileName.value = '';
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


function locate(setView,maxZoom) {
  map.locate({ setView: setView, maxZoom: maxZoom, watch: true, enableHighAccuracy: true });
}

function stopLocation() {
  map.stopLocate();
  locate(false,16);
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
        var res= data[id];
         if(!(res[res.length -1]=='}')){
          res=res.concat('"}');
        }
        const pointData = JSON.parse(res);
        var pointType = pointData.type;
        var marker;
        if (pointType == "bench") {
          marker = new L.marker(pointData.coords, { icon: benchIcon }).addTo(map).on('dblclick', viewPhoto)
            .bindPopup(pointData.description);
        } else if (pointType == "toilet") {
           marker = new L.marker(pointData.coords, { icon: toiletIcon }).addTo(map).on('dblclick', viewPhoto)
            .bindPopup(pointData.description);
        } else { // workout
           marker = new L.marker(pointData.coords, { icon: workoutIcon }).addTo(map).on('dblclick', viewPhoto)
            .bindPopup(pointData.description);
        }
        markers.push(marker);
        //adding the id
         var imgLength=document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive").length;
         var element= document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")[imgLength-1];
         element.setAttribute("id",id);
      }
    );
  }
);

//navigate button 
function navigatetionMode(){
  isNavigate = !isNavigate;

  const navigateButton = document.getElementById('navigate-button');
  map.stopLocate();
  console.log(isNavigate);
  if (isNavigate == true) { 
    console.log(20);
    map.setZoom(20);
    locate(true,20);
    navigateButton.classList.add('navigate-button--active');
  } else {
    console.log(16);
    map.setZoom(16);
    locate(false,16);
    navigateButton.classList = 'mdc-fab';
  }
};
// Utils
function getRandomId() {
  return Math.random().toString().substr(2, 9);
};

function viewPhoto(e) {
  fetch('/all_points', { method: 'GET' })
  .then(result => result.json())
  .then(data => {
    Object.keys(data).forEach(
      id => {
        var pressElem=e.target;
        var myId=pressElem._icon.getAttribute("id")
        if(id==myId){
          var res= data[id];
         if(!(res[res.length -1]=='}')){
          res=res.concat('"}');
        }
        const pointData = JSON.parse(res);
        var myImg=pointData.img;
        myImg=myImg.replace(/\s/g,'+');
        var ele=document.querySelectorAll('[alt="stam"]')[0];
        ele.setAttribute("src",myImg); 
        }
      }
    );
  }
  );
};
