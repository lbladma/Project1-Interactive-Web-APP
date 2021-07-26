// Global variable declartion
var cardsDiv = document.getElementById("cards-div");
var map;
var service;

// This function will get the info from google api and gets current user's location and initiate the map and set to the current user's location: logic referenced: https://developers.google.com/maps/documentation/javascript/places
function initMap(type) {
  // This will get the current user's location
  // navigator.geolocation.watchPosition( - was testing app by switching locations )
  navigator.geolocation.getCurrentPosition(
    // This async function will use the user's coordinates (async code is used when execution may take a while to proceed with execution without waiting especially when using laptops as opposed to mobile phones outdoors)
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      // storing lat long in local storage for use later
      localStorage.setItem('myLat', lat);
      localStorage.setItem('myLong', lon);
      // This variable will get the user's location from local storage
      const myLocation = new google.maps.LatLng(localStorage.getItem('myLat'), localStorage.getItem('myLong'));
      // This will initiate map
       map = new google.maps.Map(document.getElementById("map"), {
        // center the map based on user location
         center: myLocation,
        // This will zoom in on the map
        zoom: 10,
      });

      // The request object per locations values from local storage defined above
      const request = { location: myLocation,
        // This will set a perimeter of the search  (increased radius of search results overall to circumvent need for if condition for no results rendering)
        radius: "20000",
        // This will set the type of search to which is defined in the button clicker function below to reference specific data-feelings ties to the places library api type property
        type: type,
      };
      // This contains methods related to searching for places and retrieving details about a place.
      service = new google.maps.places.PlacesService(map);
      //  This is rendering Nearby places
      service.nearbySearch(request, (results, status) => {
        
        // This will call the render cards and passing the results
        renderCards(results);
        //console.log(results);
        // This will check the status of the place and that results are not empty
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          //removed the limiter for 8 results
          for (let i = 0; i < results.length; i++) {
            // this will call the create function and pass result[i]
            createMarker(results[i]);
          }
          // This will center the map
          map.setCenter(results[1].geometry.location);
        }
      });
    },
    () => {
          //  This will log an error should the user block their browser location 
      console.log("Couldn't get geolocation. Please check your Browser Setting Locations to 'Allow' location tracking!");
    }
  );
}


// this will create marker for the places
function createMarker(place) {
  // This will check if the data does not exist
  if (!place.geometry || !place.geometry.location) return;
  // This will create a marker
  new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP,
  });
}

// This function render Cards
var renderCards = function (results) {
  // This will empty the cards div
  cardsDiv.innerHTML = "";
  // removed the limiter for 8 results..
  for (var i = 0; i < results.length; i++) {
    if (results[i].photos) {
      cardsDiv.innerHTML += `<div class="col l4 m6 s12"> <div class="card"> <div class="card-image waves-effect waves-block waves-light"> <img class="activator cover"  width="180" height="180" src="${results[i].photos[0].getUrl()}" />
      </div>
      <div class="card-content" title="Click to learn more about the location and rating for this place"> <span id="card-title" class="card-title activator blue-text text-darken-4">${results[i].name}<i class="material-icons right">more_vert</i></span></div>
      <div class="card-reveal"><span class="card-title align-center black-text text-darken-5"> ${results[i].name} <i class="material-icons right">close</i></span>
    <p> <u><em>Address: </em></u> ${results[i].vicinity}<br>    
    <u><em>Rating: </em></u> ${results[i].rating} ⭐'s</p></div></div></div>`;
    }
  }
};

// This function will make api call
var getMotivated = function () {
  // This will make an api call to motivation api and get the data from api response
  fetch("https://quotable.io/random")
  .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // This will inject quote content, author and dateModified (https://quotable.io/random) in the modal with inline styling 
    document.getElementById("quote").innerHTML = `<h3><b> "${data.content}"</h3><h5><em> -${data.author}</em></h5><h6>${data.dateModified}</b></h6>`;
    });
};

// This will initiate the modal
document.addEventListener("DOMContentLoaded", function () {
  var options = { dismissible: true, };
  var elements = document.querySelectorAll(".modal");
  //var instances = M.Modal.init(elements, options); //removing variable storing this logic as its not being referenced any where else
  M.Modal.init(elements, options);
});

// This will handle the click action
var buttonClickHandler = function (event) {
  //  This will target the event when the user click's and get data attribute which is defined in index based on the places api library type property
  var type = event.target.getAttribute("data-feelings");
  // This will check if the data attribute is there
  if (type) {
    // This will call the function and pass in the type
    initMap(type);
  }
};


//  Those are an event listeners 
document.getElementById("sidebar").addEventListener("click", buttonClickHandler);
document.getElementById("motivation").addEventListener("click", getMotivated);
