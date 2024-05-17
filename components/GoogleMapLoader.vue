<template>
  <div class="map-container w-2/3 h-5/6 mt-10 mb-4">
    <div id="map" class="map border border-2 border-black"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Loader from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: googlemapsapikey,
  version: 'weekly',
  libraries: ['places']
});

export default {
  name: 'GoogleMap',
  setup() {
    const map = ref(null);
    let markers = []; // Array to store marker objects

    onMounted(async () => {
      const google = await loader.load();
      const { Map } = await google.maps.importLibrary('maps');

      // Get user's location
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Create map centered at user's location
        map.value = new Map(document.getElementById('map'), {
          center: userLocation,
          zoom: 15
        });

        // Perform nearby search for recycling centers
        const service = new google.maps.places.PlacesService(map.value);
        const request = {
          query: "recycling bins",
          location: userLocation,
          radius: '5000',
          type: ['recycling']
        };
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Loop through the results and create markers for each recycling center
            results.forEach(place => {
              createMarker(place);
            });
          }
        });
      }, error => {
        console.error('Error getting user location:', error);
      });
    });

    // Function to create a marker for a given place
    function createMarker(place) {
      const marker = new google.maps.Marker({
        position: place.geometry.location, // Use the location from the place object
        map: map.value,
        title: place.name // Set the title of the marker to the name of the place
      });
      markers.push(marker); // Add the marker to the markers array
    }

    return {
      map
    };
  }
}
</script>

<style>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.map-title {
  font-size: 2rem;
}

#map {
  width: 100%;
  height: 100%;
}
</style>
