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

function sortRides() {
  const sort = document.getElementById('sort');
  console.log(sort.value)
  document.getElementById('entry-list').innerHTML = "";
  fetch('/data?sort=' + sort.value).then(response => response.json()).then((entries) => {
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
  nameElement.innerHTML = entry.name + "<br/>" + entry.driverEmail;

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

function loadUser(){
    fetch('/loginStatus').then(response => response.text()).then((txt) => {
    const loginElement = document.getElementById('LoginUsingGoogle');
    console.log(txt)
    loginElement.innerHTML = txt;
    var loginForm = document.getElementById("loginForm");
    var signup = document.getElementById("signup");
    if (txt.includes("Login")) {
      loginForm.style.display = "block";
      signup.style.display = "none";
      document.getElementById("LoginUsingGoogle").innerHTML = "<i>" + txt + "</i>";
    } else{
      loginForm.style.display = "none";
      document.getElementById("additionalInfo").innerHTML = "<i>" + txt + "</i>";
    }});
}