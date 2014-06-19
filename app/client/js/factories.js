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
			callback(player.Inventory)
		}
	}
})