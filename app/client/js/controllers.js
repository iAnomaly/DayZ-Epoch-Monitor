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
	});
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
		console.log(player)
		$scope.player = player;
		Items.buildInventory(player, function (inventory){
			$scope.on_player = inventory.player;
			$scope.on_toolbelt = inventory.toolbelt;
			$scope.backpack = inventory.backpack;
		});
	});

	Players.playerHistory(player, function (history){
		console.log(history)
		$scope.inventoryHistory = history;
	})

	$scope.restore = function (characterID, dateStamp){
		if ($scope.player.Action === 2){
			$scope.message = "Player logged in. Restore blocked.";
			$scope.color = '#d00e07';
		}else{
			Players.restoreInventory(characterID, dateStamp, function (){
				$scope.message = "Restored!";
				$scope.color = '#2bd013';
			});
		}
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
	var chernarusTypeOptions = {
	  getTileUrl: function(coord, zoom) {
	      var normalizedCoord = getNormalizedCoord(coord, zoom);
	      if (!normalizedCoord) {
	        return null;
	      }
	      var bound = Math.pow(2, zoom);
	      //console.log("["+zoom+","+normalizedCoord.x+","+normalizedCoord.y+"]");
	      //return "http://skesich.no-ip.org:3000/chernarus/z"
	      return "/images/z"
	      + zoom + "x" + normalizedCoord.x + "y" + normalizedCoord.y + ".png";
	          "/" + zoom + "/" + normalizedCoord.x + "/" +
	          (bound - normalizedCoord.y - 1) + ".jpg";
	  },
	  tileSize: new google.maps.Size(256, 256),
	  maxZoom: 5,
	  minZoom: 1,
	  radius: 1738000,
	  name: "Chernarus"
	};

	var chernarusMapType = new google.maps.ImageMapType(chernarusTypeOptions);

	var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 2,
          streetViewControl: false
        };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    map.mapTypes.set('CHERNARUS', chernarusMapType);
  	map.setMapTypeId('CHERNARUS');

  	// Normalizes the coords that tiles repeat across the x axis (horizontally)
	// like the standard Google map tiles.
	function getNormalizedCoord(coord, zoom) {
	  var y = coord.y;
	  var x = coord.x;

	  // tile range in one direction range is dependent on zoom level
	  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
	  var tileRange = 1 << zoom;

	  // don't repeat across y-axis (vertically)
	  if (y < 0 || y >= tileRange) {
	    return null;
	  }

	  // don't repeat across x-axis (horizontally)
	  if (x < 0 || x >= tileRange) {
	  	return null;
	  }

	  return {
	    x: x,
	    y: y
	  };
	}

	return {}
});
