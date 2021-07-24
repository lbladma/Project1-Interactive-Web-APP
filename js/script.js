// Declare variables
var cardsDiv = document.getElementById("cards-div");
var map;
var service;

// This function will get the info from google api and gets current user's location and initiate the map and set to the current user's location
function initMap(type) {
  // This will get the current user's location
  navigator.geolocation.getCurrentPosition(
    // This async function will use the user's coordinates
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      // This variable will get the user's location '
      const myLocation = new google.maps.LatLng(lat, lon);

      // This will initiate map
      map = new google.maps.Map(document.getElementById("map"), {
        // center the map based on user location
        center: myLocation,
        // This will zoom the map
        zoom: 12,
      });

      // The request object
      const request = {
        //  This will set the user's location'
        location: myLocation,
        // This will set a radius  (increased radius of search results overall to circumvent need for if condition for no results rendering)
        radius: "50000",
        // This will set the type of search
        type: type,
      };
      // This Contain methods related to searching for places and retrieving details about a place.
      service = new google.maps.places.PlacesService(map);
      //  This A Nearby Search lets you search for places within a specified area.
      service.nearbySearch(request, (results, status) => {
        
        // This will call the render cards and passing the results
        renderCards(results);
        // This will check the status and the results
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length && i < 8; i++) {
            // this will call the create function and passing the result[i]
            createMarker(results[i]);
          }
          // This will center the map
          map.setCenter(results[1].geometry.location);
        }
      });
    },
    () => {
      //  This will log the error
      console.log("Couldn't get position!");
    }
  );
}
// this will create marker for the places
function createMarker(place) {
  // This will check if the data does not exist
  if (!place.geometry || !place.geometry.location) return;
  // This will create a marker
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP,
  });
}

// This function render Cards
var renderCards = function (results) {

  // This will empty the cards div
  cardsDiv.innerHTML = "";
  for (var i = 0; i < results.length && i < 8; i++) {
    if (results[i].photos) {
      cardsDiv.innerHTML += ` <div class="col l3 m4 s12">
      <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator"  width="180" height="180" src="${results[
          i
        ].photos[0].getUrl()}" />
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4"
          >${results[i].name}<i class="material-icons right">more_vert</i></span
        >
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4"
      >${results[i].name}<i class="material-icons right">close</i></span
    >
    <p>Address: ${results[i].vicinity}    
    <br>Rating: ${results[i].rating}</p>
  </div>
</div>
</div>
  `;
    }
  }
};

// This function will make api call
var getMotivated = function () {
  // This will make an api call and get the data from api response
  fetch("https://quotable.io/random")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // This will inject data content in the modal
      document.getElementById(
        "quote"
      ).innerHTML = `<h3><b>${data.content}</b></h3>`;
    });
};

// This will initiate the modal
document.addEventListener("DOMContentLoaded", function () {
  var options = { dismissible: true };
  var elements = document.querySelectorAll(".modal");
  // var instances = M.Modal.init(elements, options); removing variable storing this logic for the modal being built
  M.Modal.init(elements, options);
});

// This will handle the click
var buttonClickHandler = function (event) {
  //  This will target the event when the user click's and get data attribute
  var type = event.target.getAttribute("data-feelings");
  // This will check if the data attribute is there
  if (type) {
    // This will call the function and pass in the type
    initMap(type);
  }
};
//  Those are an event listeners
document
  .getElementById("sidebar")
  .addEventListener("click", buttonClickHandler);

document.getElementById("motivation").addEventListener("click", getMotivated);
