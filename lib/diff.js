//Diff engine for reporting changes in player state

module.exports = DiffEngine;

function DiffEngine () {
};

//Diffs the DBCLient polls and returns an array of changes
DiffEngine.prototype.diffPoll = function (poll, callback) {
	var self = this;
	if (!this.current_state)
	this.current_state = poll;

	if (this.current_state != poll){
		self.diffArrays(self.current_state, poll, function (diff){
			callback(diff);
		});
	};
};

DiffEngine.prototype.diffArrays = function (current_array, new_array, callback){
	var self = this;
	var diff = [];
	for (var i = 0; i < new_array.length; i++){
		self.diffObjects(current_array[i], new_array[i], function (cols){
			diff.push(cols);
		});
	};
	callback(diff);	
};

DiffEngine.prototype.diffObjects = function (current_object, new_object, callback){
	var cCols = Object.getOwnPropertyNames(current_object);
	var nCols = Object.getOwnPropertyNames(new_object);
	var loops = Object.keys(current_object).length;

	for (var i = 0; i < loops; i++){
		var col = cCols[i];
		if (current_object[col] != new_object[col]){
			var diff = {player: new_object.PlayerName, 
						column: nCols[i], 
						previous: current_object[col], 
						updated: new_object[col]};
			callback(diff);
		};
	};
};