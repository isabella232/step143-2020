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

/**
 * Adds a random greeting to the page.
 */

function getMessages() {
  const commentCount = document.getElementById('maxcomments');
  console.log(commentCount.name)
  document.getElementById('entry-list').innerHTML = "";
  fetch('/data?maxcomments=' + commentCount.value).then(response => response.json()).then((entries) => {
    const entryListElement = document.getElementById('entry-list');
    entries.forEach((entry) => {
      console.log(entry.title)
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

function createEntryElement(entry) {
  const entryElement = document.createElement('li');
  entryElement.className = 'entry collection-item';

  const nameElement = document.createElement('span');
  nameElement.innerText = entry.name;

  const capacityElement = document.createElement('span');
  capacityElement.innerText = entry.capacity;
  capacityElement.style.float = "right";
  capacityElement.style.marginRight = "10px";

  entryElement.appendChild(nameElement);
  entryElement.appendChild(capacityElement);
  return entryElement;
}
