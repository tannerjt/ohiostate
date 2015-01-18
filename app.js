var buckeyesApp = angular.module('buckeyesApp', []);
buckeyesApp.controller('main', function ($scope, $http) {
	$scope.features, $scope.geojson, $scope.featureGroup;
	$scope.appTitle = "Ohio State Buckeyes - Where the Champions Come From";
	// Initialize map
	// and set heights dynamically
	function getMapHeight() {
		return window.innerHeight - $("footer").height() - $("nav").height();
	}
	function getCardHeight() {
		return window.innerHeight - $("footer").height() - $("nav").height() - $("#options").height();
	}
	$("#mapContainer").height(getMapHeight());
	$("#cards").height(getCardHeight());
	var map = L.map('map');
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// Get geojson
	$http.get('./scripts/data/players.geojson')
		.success(function(data, status, headers, config) {
			$scope.features = data.features;
			console.log(data);
			$scope.geojson = L.geoJson(data);

			$scope.featureGroup = L.featureGroup([$scope.geojson]);
			$scope.featureGroup.addTo(map);

			map.fitBounds($scope.featureGroup.getBounds());
		})
		.error(function(data, status, headers, config){

		});

	// Continuous dynamic resize
	$(window).resize(function () {
		$("#mapContainer").height(getMapHeight());
		$("#cards").height(getCardHeight());
		map.invalidateSize();
	});

});