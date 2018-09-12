
var currentLocation;
var map;
var geo = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow;

function initMap() {
    var latlng = new google.maps.LatLng(35.6853735, 139.7530913);
    var opts = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
    };
    map = new google.maps.Map($("#map").get(0), opts);

    //Get Current Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            new google.maps.Marker({
                position: currentLocation,
                map: map
            });
            map.setCenter(currentLocation);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'エラー：現在の位置を取得できません。' :
        'エラー：このブラウザはサポートしません。');
    infoWindow.open(map);
}

function geoResultCallBack(results, status) {
    if (status != google.maps.GeocoderStatus.OK) {
        alert(status);
        return;
    }
    var latlng = results[0].geometry.location;
    new google.maps.Marker({
        position: latlng,
        map: map
    });
}

function initService() {
    //Display location from search result to location_list
    var displaySuggestions = function (predictions, status) {
        //Alert status if error occurs
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
        }

        //First clear the location_list
        $('.location_item').remove();

        //Print each item to table
        predictions.forEach(function (prediction) {
            var line;
            line = '<tr class="location_item" id="' + prediction.place_id + '"><td>';
            line += prediction.description;
            line += '</td></tr><hr>';
            $('#location_list').append(line);
            geo.geocode({ placeId: prediction.place_id }, geoResultCallBack);
        });


    };
    // Create a new session token.
    var sessionToken = new google.maps.places.AutocompleteSessionToken();

    // Pass the token to the autocomplete service.
    // (If not, each new request will be counted and billed seperatedly)
    var autocompleteService = new google.maps.places.AutocompleteService();

    // Get Place predictions, then pass to display function
    autocompleteService.getPlacePredictions({
        input: '避難',
        sessionToken: sessionToken
    },
        displaySuggestions);
}

