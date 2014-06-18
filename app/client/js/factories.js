App.factory('Players', function ($http){
	return {
		allPlayers: function (callback) {
			$http.get('/api/players').success(callback);
		},
		playerByName: function (player, callback) {
			$http.get('/api/' + player).success(callback);
		}	
	}
});