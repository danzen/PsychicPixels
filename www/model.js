
var app = function(app) {
	
	app.makeModel = function() {
		
		var d = {}; // object to hold all our data
		
		var cols = d.cols = 13;
		var data = d.data = [];
		
		for (var i=0; i<cols*cols; i++) {
			data.push(0); // not filled with black
		} 
		
		return d;
	}
	return app;
}(app || {});