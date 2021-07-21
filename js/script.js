var cardsDiv = document.getElementById("cards-div");
var apiKey = "AIzaSyAduSi1EvrfI6l250MnC45FoTrF1BSIhXo";

var addMarker;

var getLocations = function (feelings) {
  var requestUrl =
    "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
    feelings +
    "&key=" +
    apiKey;

  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      initMap(data);
      for (var i = 0; i < data.results.length && i < 8; i++) {
        if (data.results[i].photos) {
          addMarker({
            lat: data.results[i].geometry.location.lat,
            lng: data.results[i].geometry.location.lng,
          });
        }

        renderCards(data);
      }
    });
};

var renderCards = function (data) {
  cardsDiv.innerHTML = "";
  for (var i = 0; i < data.results.length && i < 8; i++) {
    if (data.results[i].photos) {
      cardsDiv.innerHTML += ` <div class="col l3 m4 s12">
    <div class="card">
  <div class="card-image waves-effect waves-block waves-light">
    <img class="activator"  width="180" height="180" src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.results[i].photos[0].photo_reference}&key=${apiKey}" />
  </div>
  <div class="card-content">
    <span class="card-title activator grey-text text-darken-4"
      >${data.results[i].name}<i class="material-icons right">more_vert</i></span
    >

  </div>
  <div class="card-reveal">
    <span class="card-title grey-text text-darken-4"
      >${data.results[i].name}<i class="material-icons right">close</i></span
    >
    <p>Address: ${data.results[i].formatted_address}    
    <br>Rating: ${data.results[i].rating}</p>
  </div>
</div>
</div>
  `;
    }
  }
};

function initMap(data) {
  var options;
  if (data === undefined) {
    options = {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 },
    };
    var map = new google.maps.Map(document.getElementById("map"), options);
  } else {
    options = {
      zoom: 12,
      center: {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      },
    };
    var map = new google.maps.Map(document.getElementById("map"), options);
  }

  // Add marker function
  addMarker = function (coords) {
    var marker = new google.maps.Marker({
      position: coords,
      map: map,
    });
  };
}
var getMotivated = function () {
  fetch("https://quotable.io/random")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.getElementById(
        "qoute"
      ).innerHTML = `<h3><b>${data.content}</b></h3>`;
    });
};

document.addEventListener("DOMContentLoaded", function () {
  var options = { dismissible: true,  };
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems, options);
});

var buttonClickHandler = function (event) {
  var feelings = event.target.getAttribute("data-feelings");
  if (feelings) {
    getLocations(feelings);
  }
};

document
  .getElementById("sidebar")
  .addEventListener("click", buttonClickHandler);

document.getElementById("motivation").addEventListener("click", getMotivated);
