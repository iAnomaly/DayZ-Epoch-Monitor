//----- Angular controllers for binding data to DOM elements ------ //

//Sets a css class on the button that represents the current active page
App.controller('ActiveCtrl', function ($scope, $location){
	$scope.isActive = function (route){
		return $location.absUrl().indexOf(route) !== -1
	}
})

//Populates the players table with data from the Players factory (/factories.js)
App.controller('PlayersCtrl', function ($scope, Players, $location){
	Players.allPlayers(function (data){
		$scope.players = data;
	})

	$scope.showPlayer = function (player){
		$location.path('/players/' + player.PlayerName)
	}
})

App.controller('ShowPlayerCtrl', function ($scope, Players, Items, $location){
	var player = $location.path().split("/")[2]

	$scope.active = 'player'
	$scope.isActive = function (tab){
		return $scope.active === tab;
		console.log(tab, $scope.active)
	}

	Players.playerByName(player, function (player){
		$scope.player = player;
		Items.buildInventory(player, function (inventory){
			$scope.on_player = inventory.player;
			$scope.on_toolbelt = inventory.toolbelt;
			$scope.backpack = inventory.backpack;
		})
	})

});


App.controller('DashboardCtrl', function ($scope) {
	
});

App.controller('MapCtrl', function($scope) {

});


