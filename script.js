const collegeLocations = [
    // Department data
    { category: "Department", location: "CS", lat: 11.0810, lng: 77.1385 },
    { category: "Department", location: "EE", lat: 11.0850, lng: 77.1430 },
    { category: "Department", location: "ME", lat: 11.0822, lng: 77.1388 },
    { category: "Department", location: "CE", lat: 11.0805, lng: 77.1397 },
    { category: "Department", location: "BT", lat: 11.0842, lng: 77.1415 },
    { category: "Department", location: "CH", lat: 11.0837, lng: 77.1375 },
    { category: "Department", location: "PH", lat: 11.0818, lng: 77.1423 },
    { category: "Department", location: "MA", lat: 11.0855, lng: 77.1400 },
    { category: "Department", location: "EC", lat: 11.0832, lng: 77.1370 },
    { category: "Department", location: "EN", lat: 11.0840, lng: 77.1420 },

    // Lab data
    { category: "Lab", location: "Lab_CS", lat: 11.0810, lng: 77.1385 },
    { category: "Lab", location: "Lab_EE", lat: 11.0850, lng: 77.1430 },
    { category: "Lab", location: "Lab_ME", lat: 11.0822, lng: 77.1388 },
    { category: "Lab", location: "Lab_CE", lat: 11.0805, lng: 77.1397 },
    { category: "Lab", location: "Lab_BT", lat: 11.0842, lng: 77.1415 },
    { category: "Lab", location: "Lab_CH", lat: 11.0837, lng: 77.1375 },
    { category: "Lab", location: "Lab_PH", lat: 11.0818, lng: 77.1423 },
    { category: "Lab", location: "Lab_MA", lat: 11.0855, lng: 77.1400 },
    { category: "Lab", location: "Lab_EC", lat: 11.0832, lng: 77.1370 },
    { category: "Lab", location: "Lab_EN", lat: 11.0840, lng: 77.1420 },

    // Placement_Hall data
    { category: "Placement_Hall", location: "Placement_Hall1", lat: 11.0810, lng: 77.1385 },
    { category: "Placement_Hall", location: "Placement_Hall2", lat: 11.0850, lng: 77.1430 },
    { category: "Placement_Hall", location: "Placement_Hall3", lat: 11.0822, lng: 77.1388 },
    { category: "Placement_Hall", location: "Placement_Hall4", lat: 11.0805, lng: 77.1397 },
    { category: "Placement_Hall", location: "Placement_Hall5", lat: 11.0842, lng: 77.1415 },
    // { category: "Placement_Hall", location: "Placement_Hall6", lat: 11.0837, lng: 77.1375 },
    // { category: "Placement_Hall", location: "Placement_Hall7", lat: 11.0818, lng: 77.1423 },
    // { category: "Placement_Hall", location: "Placement_Hall8", lat: 11.0855, lng: 77.1400 },
    // { category: "Placement_Hall", location: "Placement_Hall9", lat: 11.0832, lng: 77.1370 },
    // { category: "Placement_Hall", location: "Placement_Hall10", lat: 11.0840, lng: 77.1420 },

    // other_place data
    { category: "other_place", location: "Office 1", lat: 11.0810, lng: 77.1385 },
    { category: "other_place", location: "Office 2", lat: 11.0850, lng: 77.1430 },
    { category: "other_place", location: "Boys Hostal", lat: 11.0822, lng: 77.1388 },
    { category: "other_place", location: "Girls Hostal", lat: 11.0805, lng: 77.1397 },
    { category: "other_place", location: "Canteen 1", lat: 11.0842, lng: 77.1415 },
    { category: "other_place", location: "Canteen 2", lat: 11.0837, lng: 77.1375 },
    { category: "other_place", location: "Food Court", lat: 11.0818, lng: 77.1423 },
    { category: "other_place", location: "Parking", lat: 11.0855, lng: 77.1400 },
    { category: "other_place", location: "Boys Rest room", lat: 11.0832, lng: 77.1370 },
    { category: "other_place", location: "Girls Rest room", lat: 11.0840, lng: 77.1420 }
];

const map = L.map('map').setView([11.0834, 77.1402], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
let routingControl = null;
let routeVisible = false;

function addLocationMarkers(locationData) {
    locationData.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(markerLayer);
        marker.bindPopup(`Category: ${location.category}, Location: ${location.location}`);
    });
}

addLocationMarkers(collegeLocations);

function trackLocation() {
    const selectedCategory = document.getElementById("category").value;
    const selectedLocation = document.getElementById("location").value;

    markerLayer.clearLayers();

    const selectedLocationData = collegeLocations.find(location => location.category === selectedCategory && location.location === selectedLocation);

    if (selectedLocationData) {
        const marker = L.marker([selectedLocationData.lat, selectedLocationData.lng]).addTo(map);
        map.flyTo([selectedLocationData.lat, selectedLocationData.lng], 15, { duration: 2 });
        marker.bindPopup(`Category: ${selectedLocationData.category}, Location: ${selectedLocationData.location}`).openPopup();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                const distance = calculateDistance(userLocation, { lat: selectedLocationData.lat, lng: selectedLocationData.lng });
                Swal.fire({
                    title: "Distance",
                    text: `Distance: ${distance.toFixed(2)} km`,
                    icon: "info"
                });

                addRoute(userLocation, { lat: selectedLocationData.lat, lng: selectedLocationData.lng });
            }, error => {
                console.error('Error getting user location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    } else {
        Swal.fire({
            title: "Location Not Found",
            text: "Location not found!",
            icon: "error"
        });
    }
}

function calculateDistance(point1, point2) {
    const R = 6371;
    const dLat = deg2rad(point2.lat - point1.lat);
    const dLng = deg2rad(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function addRoute(start, end) {
    if (routingControl) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: true
    }).addTo(map);

    // Add class to the routing control for styling
    const routingContainer = document.querySelector('.leaflet-routing-container');
    routingContainer.classList.add('leaflet-routing-alt');

    // Hide route by default
    if (!routeVisible) {
        routingContainer.style.display = 'block';
    }
}

document.getElementById("searchButton").addEventListener("click", trackLocation);

document.getElementById("toggleRouteButton").addEventListener("click", () => {
    const routingContainer = document.querySelector('.leaflet-routing-container');
    routeVisible = !routeVisible;
    routingContainer.style.display = routeVisible ? 'block' : 'none';
});

document.getElementById("category").readOnly = true;
document.getElementById("location").readOnly = true;
