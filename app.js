var buckeyesApp = angular.module('buckeyesApp', []);
buckeyesApp.controller('main', function ($scope, $http) {
	$scope.features, $scope.geojson, $scope.featureGroup;
	$scope.appTitle = "2014 Ohio State Buckeyes Roster";
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

			$scope.geojson = L.geoJson(data, {
				onEachFeature : function (feature, layer) {
					var popup = L.popup()
								.setLatLng(layer.getLatLng())
								.setContent("<img src='./scripts/" + feature.properties.img + "' alt='player image' style='float:left; padding-right: 4px'>" + 
									"<b>" + feature.properties.name + "</b>"
									+ "  plays " + feature.properties.pos + " and is #"
									+ feature.properties.num + "."
									+ "  His hometown is " + feature.properties.hometown + ".</p>"
									+ "<p>At a height of " + feature.properties.ht 
									+ " he weighs " + feature.properties.wt + " lbs"
									+ "<p>You can find more information about " + feature.properties.name
									+ " through the <a href='" + feature.properties.url + "' target='_blank'>Ohio State Official Website</a></p>"

									);
					layer.bindPopup(popup);
					var myIcon = L.divIcon({className: 'my-div-icon', html : "<b>" + feature.properties.num + "</b>"});
					layer.setIcon(myIcon);
				}
			});

			$scope.featureGroup = L.featureGroup([$scope.geojson]);
			$scope.featureGroup.addTo(map);

			map.fitBounds($scope.featureGroup.getBounds());
		})
		.error(function(data, status, headers, config){

		});

	$scope.zoomPlayer = function (lat, lng) {
		map.setView(new L.LatLng(lat, lng), 11);
		$scope.geojson.eachLayer(function (marker) {
			if(marker.feature.properties.lat == lat && marker.feature.properties.lng == lng) {
				marker.openPopup();
			}
		})
	}

	// Continuous dynamic resize
	$(window).resize(function () {
		$("#mapContainer").height(getMapHeight());
		$("#cards").height(getCardHeight());
		map.invalidateSize();
	});

});