//Diff engine for reporting changes in player state

module.exports = DiffEngine;

function DiffEngine () {

};

DiffEngine.prototype.consume = function (array) {
	var self = this;
	if (!this.current_state)
	this.current_state = array;
	//console.log(array)

	if (this.current_state != array){
		var diff = [];
		for (var i = 0; i < array.length; i++){
			self.compareObjects(this.current_state[i], array[i], function (cols){
				diff.push(cols);
			})
		}
		//console.log(diff);
	}
};

DiffEngine.prototype.compareObjects = function (a, b, callback){
	var a_cols = Object.getOwnPropertyNames(a);
	var b_cols = Object.getOwnPropertyNames(b);
	var loops = Object.keys(a).length;


	for (var i = 0; i < loops; i++){
		var col = a_cols[i]
		if (a[col] === b[col]){
			//console.log(a[col], b[col]);
		}else{
			console.log('Diff! Previous: ' + a_cols[i]+ ':'+ a[col] + ' New: ' + b_cols[i]+ ':' + b[col]);
		}
	}
}