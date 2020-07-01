// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function getLocationGPS() {
    var arch = new google.maps.LatLng(28.624691, -90.184776);
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: arch});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('lat').innerHTML = position.coords.latitude;
            document.getElementById('lng').innerHTML = position.coords.longitude;
            var newCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var recenter = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: newCenter});
            }     
        )
    }
    else {
        alert('Geolocation is not supported for this Browser/OS.');
    }
}

function getMessages() {
  const commentCount = document.getElementById('maxcomments');
  console.log(commentCount.name)
  document.getElementById('entry-list').innerHTML = "";
  fetch('/data?maxcomments=' + commentCount.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      entryListElement.appendChild(createEntryElement(entry));
    })
  });
}

function loadEntries() {
  const commentCount = document.getElementById('maxcomments');
  console.log(commentCount.value)
  fetch('/data').then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      entryListElement.appendChild(createEntryElement(entry));
    })
  });
}

function checkExists() {
  fetch('/edit').then(response => response.json()).then((entries) => {
    entries.forEach((entry) => {
      console.log(entry.name)
      document.getElementById("name").value = entry.name;
      document.getElementById("capacity").value = entry.capacity;
    })
  });
}


function sortRides() {
  const sort = document.getElementById('sort');
  console.log(sort.value)
  const startlat = document.getElementById('closestartlat');
  console.log(startlat.value)
  const startlng = document.getElementById('closestartlng');
  const maxdistance = document.getElementById('maxdistance');
  document.getElementById('entry-list').innerHTML = "<tr><th>Driver Info</th><th>From</th><th>To</th><th>Current # of Riders</th><th>Capacity</th></tr>";
  // + "&startlat=" + startlat.value + "&startlng=" + startlng.value
  fetch('/data?sort=' + sort.value + "&startlat=" + startlat.value + "&startlng=" + startlng.value + "&maxdistance=" + maxdistance.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      entryListElement.appendChild(createEntryElement(entry));
    })
  });
}


function createEntryElement(entry) {
  const entryElement = document.createElement('tr');
  entryElement.className = 'entry collection-item';

  const nameElement = document.createElement('td');
  nameElement.innerHTML = entry.name + "<br/>" + "(" + entry.driverEmail + ")";

  const startElement = document.createElement('td');
  startElement.innerText = entry.start;

  const endElement = document.createElement('td');
  endElement.innerText = entry.end;

  const capacityElement = document.createElement('td');
  capacityElement.innerText = entry.capacity;

  const currentRidersElement = document.createElement('td');
  currentRidersElement.innerText = entry.currentRiders;

  var joinRideButtonElement = document.createElement('button');
  joinRideButtonElement.innerText = 'Join Ride!';
  joinRideButtonElement.style.float = "right";
  joinRideButtonElement.addEventListener('click', () => {
    joinRide(entry);
  });
  


  entryElement.appendChild(nameElement);
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(joinRideButtonElement);
  return entryElement;
}

function joinRide(entry) {
  const params = new URLSearchParams();
  params.append('id', entry.id);
  fetch('/joinride', {method: 'POST', body: params});
  location.reload();
}

//Track live location
const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById('testMap'), {
    center: { lat, lng },
    zoom: 15
  })
}

const createMarker = ({ map, position }) => {
  return new google.maps.Marker({ map, position });
}

const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if (navigator.geolocation === false) {
    return alert('Geolocation is not supported for this Browser/OS.');
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
  })
}

const getPositionErrorMessage = errMessage => {
  switch (errMessage) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout reached.';
    default:
      return null;
  }
}

function trackingMap() {
  const initialPosition = { lat: 59.325, lng: 18.069 };
  const map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });

  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
    },
    onError: err =>
      alert(getPositionErrorMessage(err.errMessage))
  })
}

function loadUser(){
    fetch('/loginStatus').then(response => response.text()).then((txt) => {
    const loginElement = document.getElementById('LoginUsingGoogle');
    console.log(txt)
    loginElement.innerHTML = txt;
    var loginForm = document.getElementById("loginForm");
    var rideshare = document.getElementById("rideshareApp");
    if (txt.includes("Login")) {
      loginForm.style.display = "block";
      rideshare.style.display = "none";
      document.getElementById("LoginUsingGoogle").innerHTML = "<i>" + txt + "</i>";
    } else {
      loginForm.style.display = "none";
      document.getElementById("logout").innerHTML = "<i>" + txt + "</i>";
    }});
}

//Create Route from Start to Destination
var start = {}

function createRoute() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var origin = new google.maps.LatLng(39.089581, -101.396101);
    var map = new google.maps.Map(document.getElementById('addRoute'), {zoom: 7, center: origin});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('lat').innerHTML = position.coords.latitude;
            document.getElementById('lng').innerHTML = position.coords.longitude;

            start = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            var newCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            }     
        )
    }

    directionsRenderer.setMap(map);

    function onClickHandler() {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
    document.getElementById('getButton').addEventListener("click", onClickHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    document.getElementById('endlat').innerHTML = 41.8781;
    document.getElementById('endlng').innerHTML = 87.6298;
    directionsService.route(
        {
            origin: start,
            destination: "chicago, IL",
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } 
            else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    )
}
