//----- Angular services for api requests and misc functions -----//


//AJAX calls to the server that return JSON data
App.factory('Players', function ($http){
	return {
		allPlayers: function (callback) {
			$http.get('/api/players').success(callback);
		},
		playerByName: function (player, callback) {
			$http.get('/api/players/' + player).success(callback);
		}
	}
});

App.factory('Items', function (){
	return {
		buildInventory: function (player, callback){
			var inventory = player.Inventory;

			var on_toolbelt = JSON.parse(inventory)[0];
			var on_person = JSON.parse(inventory)[1];
			var in_backpack = JSON.parse(player.Backpack);

			var obj = { player: on_person, toolbelt: on_toolbelt, backpack: in_backpack }
			callback(obj);
			
		}
	}
});

App.factory('GoogleMap', function (){
	var chernarusTypeOptions = {
	  getTileUrl: function(coord, zoom) {
	      var normalizedCoord = getNormalizedCoord(coord, zoom);
	      if (!normalizedCoord) {
	        return null;
	      }
	      var bound = Math.pow(2, zoom);
	      console.log("["+zoom+","+normalizedCoord.x+","+normalizedCoord.y+"]");
	      //return "http://skesich.no-ip.org:3000/chernarus/z"
	      return "http://173.55.0.167:3000/chernarus/z"
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
          zoom: 5,
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

//Socket.io factory for handling streaming in the client
App.factory('socket', function ($rootScope, $location) {
    var socket = io($location.path);
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});