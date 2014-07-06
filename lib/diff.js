//Diff engine for reporting changes in player state
//Each of these functions can be called individually

module.exports = DiffEngine;

function DiffEngine () {
};

//Special function to for returning ONLY inventory differences
DiffEngine.prototype.diffInventory = function (poll, callback){
	var self = this;
	self.diffPoll(poll, function (diff){
		var inventory_changes = diff.filter(isInventory);
		callback(inventory_changes);
	});
	function isInventory (element){
		if (element.column === 'Inventory'){
			return element.column === 'Inventory';
		}else if(element.column === 'Backpack'){
			return element.column === 'Backpack';
		};
	};
};

//Diffs the DBCLient polls and returns an array of changes
//diffPoll evaluates the incoming poll against its previous value
DiffEngine.prototype.diffPoll = function (poll, callback) {
	var self = this;
	if (!this.current_state)
	this.current_state = poll;

	if (this.current_state != poll){
		self.diffArrays(self.current_state, poll, function (diff){
			callback(diff);
		});
		this.current_state = poll;
	};
};
//Runs each array through the diffObjects function and returns the result to the callback
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
//Compares every param in the two objects and returns the diff as an object to the callback
//Example output: { player: 'Friache', column: 'KillsZ', previous: 98, updated: 99 }
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