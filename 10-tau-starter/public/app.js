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

var typeEle = document.getElementsByTagName('pio')[0];
var typeText = "Type :";
// Map press event
map.on('mousedown touchstart', function onMouseDown(event) {
  registerDialog("add-pin-dialog");
  if (pinInPlacement) {
    currentPinCoords = event.latlng;
    pinInPlacement = false;
    //changing the type to default
    typeEle.textContent = typeText;
    dialog.showModal();
    const pinButton = document.getElementById('add-pin-button');
    pinButton.classList = 'mdc-fab';
  }
});

var markerType = null;

/*ICONS CONFIG*/
var benchIcon = L.icon({
  iconUrl: 'icons/bench-icon.png',
  iconSize: [40, 55], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [25, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var toiletIcon = L.icon({
  iconUrl: 'icons/toilet-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var workoutIcon = L.icon({
  iconUrl: 'icons/workout-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var bikePathIcon = L.icon({
  iconUrl: 'icons/bike-path-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var brokenRoadIcon = L.icon({
  iconUrl: 'icons/broken-road-icon.png',
  iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var CrowdedIcon = L.icon({
  iconUrl: 'icons/crowded-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var parkIcon = L.icon({
  iconUrl: 'icons/park-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var stairsIcon= L.icon({
  iconUrl: 'icons/stairs-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});

var viewIcon = L.icon({
  iconUrl: 'icons/view-icon.png',
   iconSize: [52, 67], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [30, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -42] // point from which the popup should open relative to the iconAnchor
});
var watterIcon = L.icon({
  iconUrl: 'icons/watter-icon.png',
   iconSize: [52, 67], // size of the icon
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
  if (element.getAttribute('ispressed') === 'false') {
    element.setAttribute('ispressed', true);
    element.classList.add('example-1');
    markerType = element.getAttribute('type');
    if(element.getAttribute('desc') != null){
      typeEle.textContent = element.getAttribute('desc');
    }
  } else {
    element.setAttribute('ispressed', false);
    element.classList = '';
    markerType = null;
  }
}

//clear all markers shown on map
function clearPointsFromMap(){
  markers.forEach(function(m){
    map.removeLayer(m);
  });
  markers=[];
};

// show chosen option on map after pressing ok
function showChosenFilters(){
  clearPointsFromMap();
  var divs = document.querySelectorAll("[ispressed]");
  
  var filterItems = [];
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].getAttribute('ispressed') === 'true'){
        filterItems.push(divs[i].getAttribute('type'));
      }
    }
        fetch('/all_points', { method: 'GET' })
        .then(result => result.json())
        .then(data => {
        Object.keys(data).forEach(
        id => {
        const pointData = JSON.parse(data[id]);
        var pointType = pointData.type;
        
        if(filterItems.includes(pointType)){
           //adding point
        addPointToMapBasedType(pointType , pointData.coords,id);

        }
      }
    );
  }
);
  clearPressedType();
  dialog.close();
}

function selectAll(){
  var divs = document.querySelectorAll("[ispressed]");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].getAttribute('ispressed') === 'false') {
      divs[i].setAttribute('ispressed', true);
      divs[i].classList = 'example-1';
    }
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

// press middle button bottom right 
function showFilterOptions(){
    registerDialog("filter-dialog");
    dialog.showModal();
    const filterButton = document.getElementById('choose-filter-button');
    filterButton.classList = 'mdc-fab';
  
}


//register dialog
var dialog;
function registerDialog(dialogType){
var dialogs = document.querySelectorAll('dialog');
for (var i = 0; i < dialogs.length; i++) {
  if(dialogs[i].id===dialogType){
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
    const data = { type, description, coords: currentPinCoords , likeDislike : [0,0],img:img.toString('base64') };

      //adding point
        addPointToMapBasedType(type , currentPinCoords,id);

    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET',mode:'no-cors' //start here
    });fetch
  }
  clearPressedType();
  deactivateAddPinButton();
};

// Dialog close (without saving)
function closeDialog(){
  dialog.removeAttribute('open');
  if(dialog.id=='add-pin-dialog')
    deactivateAddPinButton();
  clearPressedType();
  var ele=document.querySelectorAll('[id="description-image"]')[0];
  ele.setAttribute("src",""); 
  ele.setAttribute("alt","no photo"); 
  if(likePressed || disLikePressed ){
     var pressElem=thisEvent.target;
     var myId=pressElem._icon.getAttribute("id")
    fetch(`/update-Like-DisLike?id=${myId}&data=${currData.likeDislike}`, {
      method: 'GET',mode:'no-cors' //start here
    });fetch
  }
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
  //var uploadedFileName = document.querySelector('#inputFileToLoad');
 // uploadedFileName.value = '';
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
         //adding point
        addPointToMapBasedType(pointType , pointData.coords,id);
        
      }
    );
  }
);

//navigate button 
function navigatetionMode(){
  isNavigate = !isNavigate;

  const navigateButton = document.getElementById('navigate-button');
  map.stopLocate();

  if (isNavigate == true) { 
    map.setZoom(20);
    locate(true,20);
    navigateButton.classList.add('navigate-button--active');
  } else {
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
          var ele=document.querySelectorAll('[id="description-image"]')[0];
          if(myImg===""){
            ele.setAttribute("alt"," no photo for marker ID : "+id.toString()); 
          }else{
            myImg=myImg.replace(/\s/g,'+');
            ele.setAttribute("src",myImg); 
          }
        }
      }
    );
  }
  );
};

var likePercentage;
function openDiscriptionDialog(e){
  fetchLikeDisLike(e);
  registerDialog("description-dialog");
  viewPhoto(e);
  
  
  
}

function addPointToMapBasedType(type , coords , id){
  var marker;
   if (type == "bench") {
         marker = new L.marker(coords, { icon: benchIcon }).addTo(map).on('click', openDiscriptionDialog);
        } else if (type == "toilet") {
         marker = new L.marker(coords, { icon: toiletIcon }).addTo(map).on('click', openDiscriptionDialog);
        } else if(type == "workout") {
         marker = new L.marker(coords, { icon: workoutIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "byke-path") {
         marker = new L.marker(coords, { icon: bikePathIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "broken-road") {
         marker = new L.marker(coords, { icon: brokenRoadIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "crowded") {
         marker = new L.marker(coords, { icon: CrowdedIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "park") {
         marker = new L.marker(coords, { icon: parkIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "stairs") {
         marker = new L.marker(coords, { icon: stairsIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "view") {
         marker = new L.marker(coords, { icon: viewIcon }).addTo(map).on('click', openDiscriptionDialog);
        }else if(type == "watter") {
         marker = new L.marker(coords, { icon: watterIcon }).addTo(map).on('click', openDiscriptionDialog);
        }
        //adding the id
         var imgLength=document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive").length;
         var element= document.getElementsByClassName("leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")[imgLength-1];
         element.setAttribute("id",id);
         console.log(id);
        markers.push(marker);
}



var currData=null;
var thisEvent;
function fetchLikeDisLike(currEvent){
  thisEvent=currEvent;
  var pressElem=currEvent.target;
   var myId=pressElem._icon.getAttribute("id")
  fetch(`/get-Like-DisLike?id=${myId}`, {
      method: 'GET'
    }) .then(result => result.json())
   .then(data => {
   currData =  JSON.parse(data);
   updateLikeDislikeStatistics();
  //change description
  if(currData.description != null){
    var ele = document.querySelector('[id="description-text"]').textContent = currData.description;
  }else{
    var ele = document.querySelector('[id="description-text"]').textContent = "";
  }
  dialog.showModal();
   });
  
   likePressed = false;
   disLikePressed = false;
   pressLikDislike('like' , false);
   pressLikDislike('disLike' , false);

}

var likePressed = false;
var disLikePressed = false;
function like(){
  if(!likePressed){
    if(disLikePressed){
      pressLikDislike('disLike' , false);
      pressLikDislike('like' , true);
      likePressed = true;
      disLikePressed = false;
      currData.likeDislike[0]++;
      currData.likeDislike[1]--;
    }else{
      pressLikDislike('like' , true);
      likePressed = true;
      currData.likeDislike[0]++;
    }
  }else{
    pressLikDislike('like' , false);
     likePressed = false;
     currData.likeDislike[0]--;
  }
   updateLikeDislikeStatistics();
  
}

function dislike(){
  if(!disLikePressed){
    if(likePressed){
      pressLikDislike('like' , false);
      pressLikDislike('disLike' , true);
      likePressed = false;
      disLikePressed = true;
      currData.likeDislike[0]--;
      currData.likeDislike[1]++;
    }else{
      pressLikDislike('disLike' , true);
      disLikePressed = true;
      currData.likeDislike[1]++;
    }
  }else{
    pressLikDislike('disLike' , false);
     disLikePressed = false;
     currData.likeDislike[1]--;
  }
   updateLikeDislikeStatistics();
}


function  pressLikDislike(type ,isPress){
  var ele;
  if(type==='like'){
    ele=document.querySelector('[id="lb-like-0"]');
    if(isPress){
      ele.setAttribute("class","lb-like lb-voted"); 
    }else{
      ele.setAttribute("class","lb-like"); 
    }
  }else if(type ==='disLike'){
     ele=document.querySelector('[id="lb-dislike-0"]');
     if(isPress){
        ele.setAttribute("class","lb-dislike lb-voted"); 
     }else{
        ele.setAttribute("class","lb-dislike");
     }
  }
}

function updateLikeDislikeStatistics(){

  var sum = currData.likeDislike[0]+currData.likeDislike[1];
  var likePercentage;
  var disLikePercentage;
  if(sum == 0){
    likePercentage=disLikePercentage=50;
  }else{
    likePercentage= Math.round((currData.likeDislike[0]/(currData.likeDislike[0]+currData.likeDislike[1]))*100);
    disLikePercentage = 100- likePercentage;
  }
  document.querySelector('[id="like-count"]').textContent=likePercentage+"%";
  document.querySelector('[id="dislike-count"]').textContent=disLikePercentage+"%";
}