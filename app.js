var buckeyesApp = angular.module('buckeyesApp', []);

buckeyesApp.controller('main', function ($scope, $http) {
	$scope.appTitle = "Ohio State Buckeyes - Where the Champions Come From";

	// Initialize map
	var map = L.map('map').setView([51.505, -0.09], 13);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// Get geojson
	$http.get('./scripts/data/players.geojson')
		.success(function(data, status, headers, config) {
			L.geoJson(data).addTo(map);
		})
		.error(function(data, status, headers, config){

		});

});