$(function () {
    $("#getCurrent").click(function() {
        map.setCenter(currentLocation);
    });

    // Go to location when click on location_item
    $('#location_list').on('click', '.location_item', function() {
        geo.geocode({placeId : $(this).attr('id')}, 
                    function (results, status) {
                        if (status != google.maps.GeocoderStatus.OK) {
                            alert(status);
                            return;
                        }
                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng);
        });
    });
    
})