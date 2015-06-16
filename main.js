angular.module("map")
	.controller("MainCtrl", function ($scope, $http) {
		$http.get('https://data.sparkfun.com/output/wpvj38xXg8HbE4x9ndYN.json')
		.then(function(Data) )
		$scope.map = {
			center: {

			}
		}
	})