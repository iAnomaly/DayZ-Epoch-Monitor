//----- Angular controllers for binding data to DOM elements ------ //

//Sets a css class on the button that represents the current active page
App.controller('ActiveCtrl', function ($scope, $location){
	$scope.isActive = function (route){
		return $location.absUrl().indexOf(route) !== -1
	}
})

//Populates the players table with data from the Players factory (/factories.js)
App.controller('PlayerCtrl', function ($scope, Players){
	Players.allPlayers(function (data){
		$scope.players = data;
	})
})

App.controller('DashboardCtrl', function ($scope) {
	
});

App.controller('MapCtrl', function($scope) {

});


