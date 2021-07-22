let map;
let service;
let infowindow;



function initMap() {
    navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude: lat, longitude: lon } }) => {
          const here = new google.maps.LatLng(lat, lon);
          map = new google.maps.Map(document.getElementById('map'), {
            center: here,
            zoom: 12,
          });
          let infowindow = new google.maps.InfoWindow({});
          const request = {
            location: here,
            radius: '5000',
            type: ['bar'],
          };
          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              for (let i = 0; i < results.length; i++) {
                console.log(results[i]);
                createMarker(results[i]);
              }
              map.setCenter(results[0].geometry.location);
            }
          });
        },
        () => {
          console.log("Couldn't get position!");
        }
      );
    }
    
    function createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        title: place.name,
      });
      marker.addListener('mouseover', function () {
        toggleBounce(marker);
        infowindow && infowindow.close();
        infowindow = new google.maps.InfoWindow({
          content: place.name,
        });
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
      marker.addListener('mouseout', function () {
        console.log('mouse leave!');
        toggleBounce(marker);
      });
    }
    
    function toggleBounce(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }