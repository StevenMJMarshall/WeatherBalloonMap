//Making the app module
var Map = angular.module('mapsApp', []);
//Defined a 'service' to pull json data. call it as a depenency
Map.factory('service', function($http) {
    var promise;
    var jsondata = {
        get: function() {
            if (!promise) {
                var promise = $http.get('https://data.sparkfun.com/output/wpvj38xXg8HbE4x9ndYN.json').success(function(response) {
                    return response.data;
                });
                return promise;
            }
        }
    };
    return jsondata;
});

//Making the first controller for stricly map functions
Map.controller('MapCtrl', function(service, $scope) {

    //Calling the json data
    service.get().then(function(d) {

        //printing json data to understand how it should be handled
        console.log(d.data)

        // -- predefining variables as needed -- //
        var ObjectCount = Number(d.data.length) - 1
        var firstLatitude = Number(d.data[0].latitude)
        var lastLatitude = Number(d.data[ObjectCount].latitude)
        var firstLongitude = Number(d.data[0].longitude)
        var lastlongitude = Number(d.data[ObjectCount].longitude)
        var mapCenter = []
        mapCenter[0] = (firstLatitude + lastLatitude) / 2
        mapCenter[1] = (firstLongitude + lastlongitude) / 2
        console.log(mapCenter)
        var markers = []
        var mapOptions = {
            zoom: 6,
            center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
            mapTypeId: google.maps.MapTypeId.HYBRID
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var marker = [];
        var flightPathCoords = []
        var infoWindow = []
            // -- Done calling out variables -- //

        //start making markers
        for (i = ObjectCount; i > 0; i--) {
            marker[i] = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(d.data[i].latitude, d.data[i].longitude),
                title: "Post: " + i
            });
            google.maps.event.addListener(marker[i], 'click', function() {
            	infowindow[i].open(map,marker[i])
            })
        };

        //Defineing a set of lat and lng for the line
        for (i = ObjectCount; i > 0; i--) {
            var latitude = d.data[i].latitude
            var longitude = d.data[i].longitude
            flightPathCoords[i] = new google.maps.LatLng(latitude, longitude)
            console.log(flightPathCoords[i])
        }
        //Making the line
        var flightPath = new google.maps.Polyline({
            map: $scope.map,
            path: flightPathCoords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 2
        });

        //Making info windows
        for (i = ObjectCount; i < ObjectCount; i--) {
        	var contentString = 'Latitude: ' + d.data[i].latitude + ', Longitude: ' + d.data[i].longitude + ' < br > ';
            infoWindow[i] = new google.maps.InfoWindow({
                content: contentString
            })
        }






















        // var createMarker = function(info) {

        //     var marker = new google.maps.Marker({
        //         map: $scope.map,
        //         position: new google.maps.LatLng(d.data.latitude, d.data.longitude),
        //         title: "marker"
        //     });

        //     marker.content = '<div class="infoWindowContent">' + 'This is a marker' + '</div>';

        //     google.maps.event.addListener(marker, 'click', function() {
        //         infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        //         infoWindow.open($scope.map, marker);
        //     });

        //     $scope.markers.push(marker);

        // };

        // for (i = 0; i < d.data.length; i++) {
        //     createMarker(markers[i]);
        // }

        $scope.openInfoWindow = function(e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

    })
});
