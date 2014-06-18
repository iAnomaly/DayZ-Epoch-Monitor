App.controller('ActiveTabCtrl', function ($scope, $location){
	$scope.isActive = function (route){
		return $location.absUrl().indexOf(route) !== -1
	}
})


App.controller('PlayerCtrl', function ($scope, Players){
	Players.allPlayers(function (data){
		$scope.players = data;
	})
})

App.controller('DashboardCtrl', function ($scope) {
	console.log("Dashboard");
});

App.controller('MapCtrl', function($scope) {
    // $scope.mapOptions = {
    //     center: new google.maps.LatLng(-34.397, 150.644),
    //     zoom: 8
    // };
    // $scope.map = new google.maps.Map($scope.map-canvas, mapOptions);
});