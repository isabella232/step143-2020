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
  //console.log(commentCount.value)
  fetch('/data').then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      entryListElement.appendChild(createEntryElement(entry));
    })
  });
}

//autofills if information is already there
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
  nameElement.innerHTML = entry.name + "<br/>" + "(" + entry.driverEmail + ")" + "<br/><br/>" + entry.rating + "/" + "5.0" + "<br/>" + "(" + entry.numratings + "ratings)";

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

  var rateButtonElement = document.createElement('button');
  rateButtonElement.innerText = 'Rate Driver';
  rateButtonElement.style.float = "right";
  rateButtonElement.addEventListener('click', () => {
    revealRate(entry);
    window.location = "#ratingdiv"
    // console.log(document);
    // console.log(document.location)
    // // location.assign("/rate.html");
    // console.log("HELLO");
    // document = "/rate.html";
    // console.log(document);
    // document.getElementById("profilerated").innerHTML = "Test";
    // console.log(document.getElementById("profilerated").innerHTML);
  });
  


  entryElement.appendChild(nameElement);
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(joinRideButtonElement);
  entryElement.appendChild(rateButtonElement);
  return entryElement;
}

function revealRate(entry) {
  document.getElementById("profilename").innerHTML = "Your rating for: " + 
  "<i>" + entry.name  + "</i>" + "<p> Driver ID: " + "<span id=\"profileId\">" + entry.driverId + "</span>" + "</p>" + "</i>";
  document.getElementById("ratingbox").innerHTML = "<textarea id=\"ratingtext\" placeholder=\"Enter float val from 1 to 5\" style=\"height:25px; width:250px\"></textarea>";
  document.getElementById("submitrating").innerHTML = "<button onclick=\"rateDriver()\">Submit Rating</button>"; 
}

function joinRide(entry) {
  const params = new URLSearchParams();
  params.append('id', entry.id);
  fetch('/joinride', {method: 'POST', body: params});
  location.reload();
}

function rateDriver() {
  const params = new URLSearchParams();
  params.append('driverId', document.getElementById("profileId").innerHTML);
  params.append('rating', document.getElementById("ratingtext").value);
  fetch('/ratedriver', {method: 'POST', body: params});
  location.reload();

}

function loadUser(){
    fetch('/loginStatus').then(response => response.text()).then((txt) => {
    const loginElement = document.getElementById('LoginUsingGoogle');
    //console.log(txt)
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

//Get location
var map;
var marker;
var markers;
var start;
var startSearchBox;
var endSearchBox;
var directionsRenderer;
var directionsService;

function initMap(){
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var mapCenter = new google.maps.LatLng(39.089581, -101.396101);

    map = new google.maps.Map(document.getElementById('addRoute'), {
        zoom: 7, 
        center: mapCenter
    })

    directionsRenderer.setMap(map);
        
    document.getElementById("getButton").addEventListener("click", function() {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    })
    autoComplete();
}

function removeMarkers(){
    for(i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
}

function getLocationGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            start = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            map.setCenter(start);
            map.setZoom(10)
            marker = new google.maps.Marker({position: start, map: map});

            var geocoder = new google.maps.Geocoder;
            reverseLatLng(geocoder, start);
            }     
        )
        
    }
    else {
        alert('Geolocation is not supported for this Browser/OS.');
    }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route(
        {
            origin: { query: document.getElementById("startAddress").value },
            destination: { query: document.getElementById("endAddress").value },
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

//Geocoding
function getLatLong(location) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'address': location
    }, 
        function(results, status) {
            if (status === "OK") {
                var coordinates = results[0].geometry.location;
                return coordinates;
            }
        }
    );
}

//Reverse Geocoding
function reverseLatLng(geocoder, start) {
    geocoder.geocode({'location': start}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById("startAddress").value = results[0].formatted_address;
            } 
            else {
                window.alert('No results found');
            }
        } 
        else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

//Search Location and place on map
function autoComplete() {
    //Create Search Box
    startSearchBox = new google.maps.places.SearchBox(document.getElementById("startAddress"));
    endSearchBox = new google.maps.places.SearchBox(document.getElementById("endAddress"));

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function() {
        startSearchBox.setBounds(map.getBounds());
    })

    startSearchBox.addListener("places_changed", function() {
        returnPlace(startSearchBox);
    })
    endSearchBox.addListener("places_changed", function() {
        returnPlace(endSearchBox);
    })
}

function returnPlace(SearchBox) {
    markers = [];
    var places = SearchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = []; 

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } 
            else {
                bounds.extend(place.geometry.location);
            }
        });
        
    map.fitBounds(bounds);

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
  const trackmap = createMap(initialPosition);
  const trackmarker = createMarker({ trackmap, position: initialPosition });

  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      trackmarker.setPosition({ lat, lng });
      trackmap.panTo({ lat, lng });
    },
    onError: err =>
      alert(getPositionErrorMessage(err.errMessage))
  })
}
