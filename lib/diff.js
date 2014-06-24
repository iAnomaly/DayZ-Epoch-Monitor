//Diff engine for reporting changes in player state

module.exports = DiffEngine;

function DiffEngine () {

};

DiffEngine.prototype.consume = function (array, callback) {
	var self = this;
	if (!this.current_state)
	this.current_state = array;

	if (this.current_state != array){
		var diff = [];
		for (var i = 0; i < array.length; i++){
			self.diffObjects(this.current_state[i], array[i], function (cols){
				diff.push(cols);
			})
		}
		callback(diff);
	}
};

DiffEngine.prototype.diffObjects = function (current_object, new_object, callback){
	var cCols = Object.getOwnPropertyNames(current_object);
	var nCols = Object.getOwnPropertyNames(new_object);
	var loops = Object.keys(current_object).length;

	for (var i = 0; i < loops; i++){
		var col = cCols[i];
		if (current_object[col] != new_object[col]){
			var diff = { column: nCols[i], previous: current_object[col], updated: new_object[col] };
			callback(diff);
		}
	}
};