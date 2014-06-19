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