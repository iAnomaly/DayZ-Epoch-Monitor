//----- Angular controllers for binding data to DOM elements ------ //

//Sets a css class on the button that represents the current active page
App.controller('ActiveCtrl', function ($scope, $location){
	$scope.isActive = function (route){
		return $location.absUrl().indexOf(route) !== -1
	}
});

App.controller('DashboardCtrl', function ($scope, Players) {

	Players.allPlayers(function (data){
		$scope.players = data;
	})
	
});

//Populates the /players.html page with data from the Players factory (/factories.js).
App.controller('PlayersCtrl', function ($scope, Players, $location, socket){
	Players.allPlayers(function (data){
		$scope.players = data;
		$scope.predicate = '-KillsZ';
	})

	$scope.showPlayer = function (player){
		$location.path('/players/' + player.PlayerName);
	}
	//Listens on the 'players:changed' socket.io channel and updates the scope on changes
	socket.on('players:changed', function (data){
    	$scope.players = data;
	});

});

//Controls the /player.html page (single player only)
App.controller('PlayerCtrl', function ($scope, Players, Items, $location){
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

	Players.playerHistory(player, function (history){
		console.log(history)
		$scope.inventoryHistory = history;
	})

	$scope.restore = function (characterID, dateStamp){
		Players.restoreInventory(characterID, dateStamp, function (){
			console.log('sent restore to server');
		});
	};
});

App.controller('DashboardCtrl', function ($scope, Players, socket, $location) {

	Players.allPlayers(function (data){
		$scope.players = data;
	})

	$scope.showPlayer = function (player){
		$location.path('/players/' + player.PlayerName);
	}
	socket.on('players:changed', function (data){
    	$scope.players = data;
	});
	
});

App.controller('MapCtrl', function ($scope, GoogleMap) {

});
