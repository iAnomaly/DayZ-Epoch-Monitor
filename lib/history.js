var fs = require('fs');


exports.consume = function (object){
	fs.writeFile('output.txt', object);
	console.log(object);
}




