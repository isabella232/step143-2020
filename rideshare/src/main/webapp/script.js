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
  document.getElementById('entry-list').innerHTML = "<tr><th>Driver Info</th><th>From</th><th>To</th><th>Distance</th><th>Ride Date</th><th>Price($)</th><th>Payment Method</th><th>Current # of Riders</th><th>Capacity</th></tr>";
  console.log(commentCount.name)
  fetch('/data?type=table&maxcomments=' + commentCount.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      var temp = createEntryElement(entry);
      // getRating(entry).then(rating =>  {
      //   console.log(rating);
      //   temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
      //   entryListElement.appendChild(temp);
      // });
      entryListElement.appendChild(temp);
    })
  });
}

function getMessagesGuest() {
  const commentCount = document.getElementById('maxcomments');
  document.getElementById('entry-list-guest').innerHTML = "<tr><th>Driver Info</th><th>From</th><th>To</th><th>Distance</th><th>Ride Date</th><th>Price($)</th><th>Payment Method</th><th>Current # of Riders</th><th>Capacity</th></tr>";
  console.log(commentCount.name)
  fetch('/data?type=table&maxcomments=' + commentCount.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list-guest');
    entries.forEach((entry) => {
      console.log(entry.name)
      var temp = createEntryElementGuest(entry);
      // getRating(entry).then(rating =>  {
      //   console.log(rating);
      //   temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
      //   
      // });
      entryListElement.appendChild(temp);
    })
  });
}
function loadEntriesGuest() {
  //console.log(commentCount.value)
  const entryListElement = document.getElementById('entry-list-guest');
  fetch('/data?type=table').then(response => response.json()).then((entries) => {
    entries.forEach((entry) => {
      
      console.log(entry.name)
      var temp = createEntryElementGuest(entry);
      // getRating(entry).then(rating =>  {
      //   console.log(rating);
      //   temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
      //   entryListElement.appendChild(temp);
      // });
      entryListElement.appendChild(temp);
    })
  });
}

function loadEntries() {
  const commentCount = document.getElementById('maxcomments');
  //console.log(commentCount.value)
  fetch('/data?type=table').then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.name)
      var temp = createEntryElement(entry);
      // temp.cells[0] = temp.cells[0] + getRating(entry).then(function(result) {
      //   return result
      // })
      getRating(entry).then(rating =>  {
        console.log(rating);
        temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
        entryListElement.appendChild(temp);
      });
      
    })
  });
  fetch('/data?type=myrides').then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('myrides');
    entries.forEach((entry) => {
      console.log(entry.name)
      var temp = createEntryElementNoJoin(entry);
      getRating(entry).then(rating =>  {
        console.log(rating);
        temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
        entryListElement.appendChild(temp);
      });
    })

  });
  fetch('/data?type=driverrides').then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('driverrides');
    entries.forEach((entry) => {
      console.log(entry.name)
      var temp = createEntryElementRemove(entry);
      getRating(entry).then(rating =>  {
        console.log(rating);
        temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
        entryListElement.appendChild(temp);
      });
    })

  });
}

//autofills if information is already there
function checkExists() {
  fetch('/edit?type=1').then(response => response.json()).then((entries) => {
    entries.forEach((entry) => {
      document.getElementById("name").value = entry.name;
      document.getElementById("capacity").value = entry.capacity;
      document.getElementById("uploadUrl").value = entry.uploadUrl;
    })
  });
}


 function sortRides() {
  const sort = document.getElementById('sort');
  const startlat = document.getElementById('closestartlat');
  const startlng = document.getElementById('closestartlng');
  const closeendlat = document.getElementById('closeendlat');
  const closeendlng = document.getElementById('closeendlng');
  const maxdistance = document.getElementById('maxdistance');
  const maxdistanceend = document.getElementById('maxdistanceend');
  document.getElementById('entry-list').innerHTML = "<tr><th>Driver Info</th><th>From</th><th>To</th><th>Distance</th><th>Ride Date</th><th>Price($)</th><th>Payment Method</th><th>Current # of Riders</th><th>Capacity</th></tr>";
  // + "&startlat=" + startlat.value + "&startlng=" + startlng.value
  var hold = [];
  fetch('/data?type=table&sort=' + sort.value + "&startlat=" + startlat.value + "&startlng=" + startlng.value + "&maxdistance=" + maxdistance.value + "&maxdistanceend=" + maxdistanceend.value + "&closeendlat=" + closeendlat.value + "&closeendlng=" + closeendlng.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
     //var temp = createEntryElement(entry);
      console.log(entry.name);
      hold.push(entry);
        
      });
    console.log(hold);
    hold.reduce((p, fn) => { 
      return p.then(() => {
        return getRating(fn).then(rating =>  {
          temp = createEntryElement(fn);
          temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
          entryListElement.appendChild(temp);
      })});
    }, Promise.resolve());
  });
}

function sortRidesGuest() {
  const sort = document.getElementById('sort-guest');
  document.getElementById('entry-list-guest').innerHTML = "<tr><th>Driver Info</th><th>From</th><th>To</th><th>Distance</th><th>Ride Date</th><th>Price($)</th><th>Payment Method</th><th>Current # of Riders</th><th>Capacity</th></tr>";
  // + "&startlat=" + startlat.value + "&startlng=" + startlng.value
  var hold = [];
  fetch('/data?type=table&sort=' + sort.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list-guest');
    entries.forEach((entry) => {
      var temp = createEntryElementGuest(entry);
      console.log(entry.name);
      // hold.push(entry);
        // .then(rating =>  {
        // temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
        // entryListElement.appendChild(temp);
        entryListElement.appendChild(temp);
      });
    console.log(hold);
    // hold.reduce((p, fn) => { 
    //   return p.then(() => {
    //     return getRating(fn).then(rating =>  {
    //       temp = createEntryElementGuest(fn);
    //       temp.cells[0].innerHTML = temp.cells[0].innerHTML + "<br/><br/>" + rating[0].toFixed(2) + " / " + "5.00" + "<br/>" + "(" + rating[1] + " ratings)";
    //       entryListElement.appendChild(temp);
    //   })});
    // }, Promise.resolve());
  });
}

function appendRatings() {
  var table = document.getElementById("entry-list");
  for (var i = 1; i < table.rows.length; i++) {
    console.log(table.rows[i].cells[0].innerHTML);
    table.rows[i].cells[0].innerHTML = table.rows[i].cells[0].innerHTML + "HELLO";
  }
}

// stores rating and numratings as an array to use when loading rides
async function getRating(entry) {
  let response = await fetch('/edit?type=' + entry.driverId);
  let results = await response.json();
  return [results[0].rating, results[0].numratings];
  // fetch('/edit?type=' + entry.driverId).then(response => response.json()).then((entries) => {
  //   console.log(entries[0].rating);
  //   return entries[0].rating;
  // })
}

//Reverse Geocoding Display in table
function reverseDisplay(geocoder, start, id) {
  var returnval = "";
      geocoder.geocode({'location': start}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
              console.log(results[0].formatted_address);
              var loc = document.getElementById(id);
              loc.innerHTML = results[0].formatted_address + "<br/><br/>" + loc.innerHTML; 
            } 
            else {
                window.alert('No results found');
                returnval = "NOT FOUND";
            }
        } 
        else {
            // window.alert('Geocoder failed due to: ' + status);
            // returnval = "ERROR";
            console.log("Query Error:" + status);
        }
    });
}

function removeRide(entry) {
  const params = new URLSearchParams();
  params.append('id', entry.id);
  fetch('/deleteride', {method: 'POST', body: params});
  location.reload();
}

function createEntryElementGuest(entry) {
  const entryElement = document.createElement('tr');
  entryElement.className = 'entry collection-item';

  const nameElement = document.createElement('td');
  console.log(typeof entry.driverId);
  // <br/><button height=\"20px\" onclick=\"getReviews(" + "n" + entry.driverId + ")\">See Reviews</button>";
  nameElement.innerHTML = entry.name + "<br/>" + "(" + entry.driverEmail + ")" + "<br/>";

  const startElement = document.createElement('td');
  // startElement.id = entry.id + "start";
  // var geocoder = new google.maps.Geocoder;
  // start = {
  //             lat: Number(entry.start.substr(0, entry.start.indexOf(','))),
  //             lng: Number(entry.start.substr(entry.start.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, start, entry.id + "start");
  // startElement.innerText = entry.start;
  // startElement.innerHTML = entry.startAddress + "<br/><br/>" + entry.start;
  startElement.innerHTML = entry.startAddress

  const endElement = document.createElement('td');
  // endElement.id = entry.id + "end";
  // end = {
  //             lat: Number(entry.end.substr(0, entry.end.indexOf(','))),
  //             lng: Number(entry.end.substr(entry.end.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, end, entry.id + "end");
  // endElement.innerText = entry.end;
  // endElement.innerHTML = entry.endAddress + "<br/><br/>" + entry.end;
  endElement.innerHTML = entry.endAddress

  const capacityElement = document.createElement('td');
  capacityElement.innerText = entry.capacity;

  const currentRidersElement = document.createElement('td');
  currentRidersElement.innerText = entry.currentRiders;


  var dateElement = document.createElement('td');
  dateElement.innerHTML = entry.ridedate + "<br/>" + entry.ridetime;

  var priceElement = document.createElement('td');
  priceElement.innerHTML = "$" + entry.price;

  var paymentMethodElement = document.createElement('td');
  paymentMethodElement.innerHTML = entry.paymentMethod;
  
  var distanceTimeElement = document.createElement('td');
  distanceTimeElement.innerHTML = entry.distance + "<br/>" + "(" + entry.eta + ")";
  var showRideElement = document.createElement("button");
  showRideElement.innerText = "Show Route";
  showRideElement.style.float = "right";
  showRideElement.style.backgroundColor = "#388E8E";
  showRideElement.addEventListener('click', () => {
    showRideRouteGuest(entry.start, entry.end);
    window.location = "#rideHeadingGuest"
  });

  entryElement.appendChild(nameElement);
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(distanceTimeElement);
  entryElement.appendChild(dateElement);
  entryElement.appendChild(priceElement);
  entryElement.appendChild(paymentMethodElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(showRideElement);
  return entryElement;
}

function createEntryElementRemove(entry) {
  const entryElement = document.createElement('tr');
  entryElement.className = 'entry collection-item';

  const startElement = document.createElement('td');
  // startElement.id = entry.id + "start";
  // var geocoder = new google.maps.Geocoder;
  // start = {
  //             lat: Number(entry.start.substr(0, entry.start.indexOf(','))),
  //             lng: Number(entry.start.substr(entry.start.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, start, entry.id + "start");
  // startElement.innerText = entry.start;
  // startElement.innerHTML = entry.startAddress + "<br/><br/>" + entry.start;
  startElement.innerHTML = entry.startAddress

  const endElement = document.createElement('td');
  // endElement.id = entry.id + "end";
  // end = {
  //             lat: Number(entry.end.substr(0, entry.end.indexOf(','))),
  //             lng: Number(entry.end.substr(entry.end.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, end, entry.id + "end");
  // endElement.innerText = entry.end;
  // endElement.innerHTML = entry.endAddress + "<br/><br/>" + entry.end;
  endElement.innerHTML = entry.endAddress

  const capacityElement = document.createElement('td');
  capacityElement.innerText = entry.capacity;

  const currentRidersElement = document.createElement('td');
  currentRidersElement.innerText = entry.currentRiders;

  var removeRideButtonElement = document.createElement('button');
  removeRideButtonElement.innerText = 'Delete Ride!';
  removeRideButtonElement.style.float = "right";
  removeRideButtonElement.style.backgroundColor = "#CF5300";
  removeRideButtonElement.addEventListener('click', () => {
    removeRide(entry);
  });

  var rateButtonElement = document.createElement('button');
  rateButtonElement.innerText = 'Rate Driver';
  rateButtonElement.style.float = "right";
  rateButtonElement.addEventListener('click', () => {
    revealRate(entry);
    window.location = "#ratingdiv"
  });

  var dateElement = document.createElement('td');
  dateElement.innerHTML = entry.ridedate + "<br/>" + entry.ridetime;

  var distanceTimeElement = document.createElement('td');
  distanceTimeElement.innerHTML = entry.distance + "<br/>" + "(" + entry.eta + ")";

  var priceElement = document.createElement('td');
  priceElement.innerHTML = "$" + entry.price;

  var paymentMethodElement = document.createElement('td');
  paymentMethodElement.innerHTML = entry.paymentMethod;

  var showRideElement = document.createElement("button");
  showRideElement.innerText = "Show Route";
  showRideElement.style.float = "right";
  showRideElement.style.backgroundColor = "#388E8E";
  showRideElement.addEventListener('click', () => {
    showRideRoute(entry.start, entry.end);
    window.location = "#rideHeading"
  });
  
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(distanceTimeElement);
  entryElement.appendChild(dateElement);
  entryElement.appendChild(priceElement);
  entryElement.appendChild(paymentMethodElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(removeRideButtonElement);
  entryElement.appendChild(rateButtonElement);
  entryElement.appendChild(showRideElement);
  return entryElement;
}

function createEntryElementNoJoin(entry) {
  const entryElement = document.createElement('tr');
  entryElement.className = 'entry collection-item';

  const nameElement = document.createElement('td');
  nameElement.innerHTML = entry.name + "<br/>" + "(" + entry.driverEmail + ")";

  const startElement = document.createElement('td');
  // startElement.id = entry.id + "start";
  // var geocoder = new google.maps.Geocoder;
  // start = {
  //             lat: Number(entry.start.substr(0, entry.start.indexOf(','))),
  //             lng: Number(entry.start.substr(entry.start.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, start, entry.id + "start");
  // startElement.innerText = entry.start;
  // startElement.innerHTML = entry.startAddress + "<br/><br/>" + entry.start;
  startElement.innerHTML = entry.startAddress

  const endElement = document.createElement('td');
  // endElement.id = entry.id + "end";
  // end = {
  //             lat: Number(entry.end.substr(0, entry.end.indexOf(','))),
  //             lng: Number(entry.end.substr(entry.end.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, end, entry.id + "end");
  // endElement.innerText = entry.end;
  // endElement.innerHTML = entry.endAddress + "<br/><br/>" + entry.end;
  endElement.innerHTML = entry.endAddress

  const capacityElement = document.createElement('td');
  capacityElement.innerText = entry.capacity;

  const currentRidersElement = document.createElement('td');
  currentRidersElement.innerText = entry.currentRiders;

  var leaveRideButtonElement = document.createElement('button');
  leaveRideButtonElement.innerText = 'Leave Ride!';
  leaveRideButtonElement.style.float = "right";
  leaveRideButtonElement.style.backgroundColor = "#8b0000";
  leaveRideButtonElement.addEventListener('click', () => {
    leaveRide(entry);
  });

  var rateButtonElement = document.createElement('button');
  rateButtonElement.innerText = 'Rate Driver';
  rateButtonElement.style.float = "right";
  rateButtonElement.addEventListener('click', () => {
    revealRate(entry);
    window.location = "#ratingdiv"
  });

  var dateElement = document.createElement('td');
  dateElement.innerHTML = entry.ridedate + "<br/>" + entry.ridetime;

  var distanceTimeElement = document.createElement('td');
  distanceTimeElement.innerHTML = entry.distance + "<br/>" + "(" + entry.eta + ")";

  var priceElement = document.createElement('td');
  priceElement.innerHTML = "$" + entry.price;

  var paymentMethodElement = document.createElement('td');
  paymentMethodElement.innerHTML = entry.paymentMethod;

  var showRideElement = document.createElement("button");
  showRideElement.innerText = "Show Route";
  showRideElement.style.float = "right";
  showRideElement.style.backgroundColor = "#388E8E";
  showRideElement.addEventListener('click', () => {
    showRideRoute(entry.start, entry.end);
    window.location = "#rideHeading"
  });
  
  
  entryElement.appendChild(nameElement);
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(distanceTimeElement);
  entryElement.appendChild(dateElement);
  entryElement.appendChild(priceElement);
  entryElement.appendChild(paymentMethodElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(leaveRideButtonElement);
  entryElement.appendChild(showRideElement);
  entryElement.appendChild(rateButtonElement);
  return entryElement;
}

function getReviews(entry) {
  console.log(typeof entry.driverId);
  fetch("/profile?seereviews=1&driverId=" + entry.driverId).then(response => response.text())
    .then((txt) => {
        document.getElementById("seereviews").innerHTML = txt;
        window.location = "#seereviews"
    })
}


function createEntryElement(entry) {
  const entryElement = document.createElement('tr');
  entryElement.className = 'entry collection-item';

  const nameElement = document.createElement('td');
  console.log(typeof entry.driverId);

  var showButtonElement = document.createElement('button');
  showButtonElement.innerText = 'See Reviews';
  showButtonElement.style.backgroundColor = "#976bb6";
  showButtonElement.addEventListener('click', () => {
    getReviews(entry);
    window.location = "#seereviews";
  });
  // <br/><button height=\"20px\" onclick=\"getReviews(" + "n" + entry.driverId + ")\">See Reviews</button>";
  nameElement.innerHTML = entry.name + "<br/>" + "(" + entry.driverEmail + ")" + "<br/>";

  var showRideElement = document.createElement("button");
  showRideElement.innerText = "Show Route";
  showRideElement.style.float = "right";
  showRideElement.style.backgroundColor = "#388E8E";
  showRideElement.addEventListener('click', () => {
    showRideRoute(entry.start, entry.end);
    window.location = "#rideHeading"
  });
  


  const startElement = document.createElement('td');
  // startElement.id = entry.id + "start";
  // var geocoder = new google.maps.Geocoder;
  // start = {
  //             lat: Number(entry.start.substr(0, entry.start.indexOf(','))),
  //             lng: Number(entry.start.substr(entry.start.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, start, entry.id + "start");
  // startElement.innerText = entry.start;
  // startElement.innerHTML = entry.startAddress + "<br/><br/>" + entry.start;
  startElement.innerHTML = entry.startAddress

  const endElement = document.createElement('td');
  // endElement.id = entry.id + "end";
  // end = {
  //             lat: Number(entry.end.substr(0, entry.end.indexOf(','))),
  //             lng: Number(entry.end.substr(entry.end.indexOf(',') + 1))
  //           }
  // reverseDisplay(geocoder, end, entry.id + "end");
  // endElement.innerText = entry.end;
  // endElement.innerHTML = entry.endAddress + "<br/><br/>" + entry.end;
  endElement.innerHTML = entry.endAddress

  const capacityElement = document.createElement('td');
  capacityElement.innerText = entry.capacity;

  const currentRidersElement = document.createElement('td');
  currentRidersElement.innerText = entry.currentRiders;

  var joinRideButtonElement = document.createElement('button');
  joinRideButtonElement.innerText = 'Join Ride!';
  joinRideButtonElement.style.float = "right";
  joinRideButtonElement.style.backgroundColor = "#272e91";
  joinRideButtonElement.addEventListener('click', () => {
    joinRide(entry)
    document.getElementById("notify").innerHTML = "You have successfully joined ride " + entry.id;
  });

  var rateButtonElement = document.createElement('button');
  rateButtonElement.innerText = 'Rate Driver';
  rateButtonElement.style.float = "right";
  rateButtonElement.addEventListener('click', () => {
    revealRate(entry);
    window.location = "#ratingdiv"
  });

  var dateElement = document.createElement('td');
  dateElement.innerHTML = entry.ridedate + "<br/>" + entry.ridetime;

  var priceElement = document.createElement('td');
  priceElement.innerHTML = "$" + entry.price.toString();

  var paymentMethodElement = document.createElement('td');
  paymentMethodElement.innerHTML = entry.paymentMethod;
  
  var distanceTimeElement = document.createElement('td');
  distanceTimeElement.innerHTML = entry.distance + "<br/>" + "(" + entry.eta + ")";

  var showRideElement = document.createElement("button");
  showRideElement.innerText = "Show Route";
  showRideElement.style.float = "right";
  showRideElement.style.backgroundColor = "#388E8E";
  showRideElement.addEventListener('click', () => {
    showRideRoute(entry.start, entry.end);
    window.location = "#rideHeading"
  });
  
  entryElement.appendChild(nameElement);
  entryElement.appendChild(startElement);
  entryElement.appendChild(endElement);
  entryElement.appendChild(distanceTimeElement);
  entryElement.appendChild(dateElement);
  entryElement.appendChild(priceElement);
  entryElement.appendChild(paymentMethodElement);
  entryElement.appendChild(currentRidersElement);
  entryElement.appendChild(capacityElement);
  entryElement.appendChild(joinRideButtonElement);
  entryElement.appendChild(rateButtonElement);
  entryElement.appendChild(showButtonElement);
  entryElement.appendChild(showRideElement);
  return entryElement;
}

function revealRate(entry) {
  var flag = 0;
  fetch('/ratedriver?driverId=' + entry.driverId).then(response => response.text())
    .then((txt) => {
        const alreadyrated = document.getElementById('alreadyrated');
        alreadyrated.innerHTML = txt;
        if (txt.includes("already")) {
          flag = 1;
        }
        if (flag === 0) {
            document.getElementById("profilename").innerHTML = "Your rating for: " + 
            "<i>" + entry.name  + "</i>" + "<p> Driver ID: " + "<span id=\"profileId\">" + entry.driverId + "</span>" + "</p>" + "</i>";
            document.getElementById("ratingbox").innerHTML = 
            "<h3> Move slider accordingly (farthest left = 1, farthest right = 5)</h3>" +
            "<div class=\"slidecontainer\"><input type=\"range\" min=\"1\" max=\"5\" value=\"3\" class=\"slider\" id=\"ratingtext\"></div>";
            document.getElementById("reviewbox").innerHTML = "<h4>Leave a review (optional) </h4>" + "<textarea id=\"review\" style=\"width:80%\" height=\"200px\"></textarea>" + "<br/" + 
            "<label><input id=\"displayname\" name=\"displayname\" type=\"checkbox\" class=\"filled-in\" checked=\"checked\" />" + "<span>Display name next to review</span>" + "</label>";

          // <input type=\"number\" min=\"1\" max=\"5\" id=\"ratingtext\" placeholder=\"Enter float val from 1 to 5\" style=\"height:25px; width:250px\">";
            document.getElementById("submitrating").innerHTML = "<button onclick=\"rateDriver()\">Submit Rating</button>"; 
            
        }
        window.location = "#ratingdiv"
    });
}

function joinRide(entry) {
  const params = new URLSearchParams();
  params.append('id', entry.id);
  fetch('/joinride', {method: 'POST', body: params}).then(() => {
    // location.reload().then(() => {
    //   document.getElementById("notify").innerHTML = "You have successfully joined ride " + entry.id;
    //   window.
    location.reload();
  });
}

function leaveRide(entry) {
  const params = new URLSearchParams();
  params.append('id', entry.id);
  fetch('/leaveride', {method: 'POST', body: params});
  location.reload();
}

function rateDriver() {
  const params = new URLSearchParams();
  params.append('driverId', document.getElementById("profileId").innerHTML);
  params.append('rating', document.getElementById("ratingtext").value);
  params.append('review', document.getElementById("review").value);
  params.append('displayname', document.getElementById("displayname").checked);

  var d = new Date(Date.now());
  var n = d.toDateString();
  params.append('date', n);
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
      loginForm.style.visibility = "visible";
      rideshare.style.display = "none";
      document.getElementById("LoginUsingGoogle").innerHTML = "<i>" + txt + "</i>";
    } else if (txt.includes("NONEXISTENTERROR")) {
      location.assign("/editAccount.html");
    } else {
      loginForm.style.display = "none";
      rideshare.style.display = "block";
      var userSplit = txt.split("!");
      document.getElementById("userEmail").innerHTML = userSplit[0];
      document.getElementById("logout").innerHTML = userSplit[1];
    }});
}

function loadProfile(){
    fetch('/profile?seereviews=0').then(response => response.text())
    .then((txt) => {
        const loginElement = document.getElementById('profile');
        console.log(txt)
        loginElement.innerHTML = txt;
        document.getElementById("profile").innerHTML = "<i>" + txt + "</i>";
    });
}

function ReplaceImage(){
    document.getElementById("profilePicture").src="https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png"
}

//Create Map and Routes
var start = {}
var map;
var sortMap;
var marker;
var markers = [];
var endAddress;
var start = {};
var end;
var startSearchBox;
var endSearchBox;
var sortRidesSearchBox;
var geocoder;
var directionsRenderer;
var directionsService;
var directionsRendererGuest;
var directionsServiceGuest;

function initMapGuest(){
    directionsServiceGuest = new google.maps.DirectionsService();
    directionsRendererGuest = new google.maps.DirectionsRenderer();
    var mapCenter = new google.maps.LatLng(39.089581, -101.396101);

    map = new google.maps.Map(document.getElementById('addRouteGuest'), {
        zoom: 7, 
        center: mapCenter
    })

    geocoder = new google.maps.Geocoder();
    directionsRendererGuest.setMap(map);
    directionsRendererGuest.setPanel(document.getElementById("directionsGuest"));
        
    document.getElementById("getButton").addEventListener("click", function() {
        removeMarkers();
        calculateAndDisplayRoute(directionsServiceGuest, directionsRendererGuest);
        getDistance();
    })
    autoComplete();
}

function initMap(){
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var mapCenter = new google.maps.LatLng(39.089581, -101.396101);

    map = new google.maps.Map(document.getElementById('addRoute'), {
        zoom: 7, 
        center: mapCenter
    })

    sortMap = new google.maps.Map(document.getElementById('sortMap'), {
        zoom: 7, 
        center: mapCenter
    })
    geocoder = new google.maps.Geocoder();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions"));
        
    document.getElementById("getButton").addEventListener("click", function() {
        removeMarkers();
        calculateAndDisplayRoute(directionsService, directionsRenderer);
        getDistance();
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
            console.log(start);
            map.setCenter(start);
            map.setZoom(10);

            markers = [];
            removeMarkers();
            markers.push(new google.maps.Marker({
                map: map,
                position: start
            })
            )

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
                var startAddress = document.getElementById("startAddress").value;
                var endAddress = document.getElementById("endAddress").value;
                getLatLng(startAddress, endAddress);
                
            } 
            else {
                window.alert('Please enter valid address');
            }
        }
    )
}

//Geocoding
function getLatLng(startAddress, endAddress) {
    var addressArray = [startAddress, endAddress];
    
    geocoder.geocode({
        'address': addressArray[0]
    }, 
    function(results, status) {
        if (status === "OK") {
            document.getElementById("lat").value = results[0].geometry.location.lat();
            document.getElementById("lng").value = results[0].geometry.location.lng();
        }
    })

    geocoder.geocode({
        'address': addressArray[1]
    }, 
    function(results, status) {
        if (status === "OK") {
            document.getElementById("endlat").value = results[0].geometry.location.lat();
            document.getElementById("endlng").value = results[0].geometry.location.lng();
        }
    })
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
    sortRidesSearchBox = new google.maps.places.SearchBox(document.getElementById("sortRidesBox"));
    sortRidesEndSearchBox = new google.maps.places.SearchBox(document.getElementById("sortRidesEndBox"));

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function() {
        startSearchBox.setBounds(map.getBounds());
    })

    startSearchBox.addListener("places_changed", function() {
        removeMarkers();
        returnPlace(startSearchBox);
    })
    endSearchBox.addListener("places_changed", function() {
        removeMarkers();
        returnPlace(endSearchBox);
    })

    sortRidesSearchBox.addListener("places_changed", function() {
        geocoder.geocode({
            'address': document.getElementById("sortRidesBox").value
        }, 
        function(results, status) {
            if (status === "OK") {
                document.getElementById("closestartlat").value = results[0].geometry.location.lat();
                document.getElementById("closestartlng").value = results[0].geometry.location.lng();
            }
        })
    })

    sortRidesEndSearchBox.addListener("places_changed", function() {
        geocoder.geocode({
            'address': document.getElementById("sortRidesEndBox").value
        }, 
        function(results, status) {
            if (status === "OK") {
                document.getElementById("closeendlat").value = results[0].geometry.location.lat();
                document.getElementById("closeendlng").value = results[0].geometry.location.lng();
            }
        })
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
            )

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

//Show distance of route
function getDistance() {
    var origin = document.getElementById("startAddress").value;
    var destination = document.getElementById("endAddress").value;

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, callback
    )

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            var distanceTag = document.getElementById("distance");
            var etaTag = document.getElementById("eta");

            distanceTag.innerHTML = "";
            etaTag.innerHTML = "";

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    distanceTag.innerHTML += results[j].distance.text;
                    etaTag.innerHTML += results[j].duration.text;
                }
            }
        }
    }
}

//Show Route for Posted Ride
function showRideRoute(origin, destination){ //Pass start and end coordinates to this function
    removeMarkers();
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            }
        }
    )
}

//Show Route for Posted Ride (Guests)
function showRideRouteGuest(origin, destination){ //Pass start and end coordinates to this function
    removeMarkers();
    directionsServiceGuest.route(
        {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRendererGuest.setDirections(response);
            }
        }
    )
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  document.getElementById('sortSection').style.display = "block";
  evt.currentTarget.className += " active";
}