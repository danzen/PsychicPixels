
var app = function(app) {
	
	app.makeModel = function() {
		
		var d = {}; // object to hold all our data
		//#e9cfc0
		d.colors = ["#a1d1c3","#ffa580","#e3b584","#ddbfeb","#fdf377","#c5ea97"];
		zim.shuffle(d.colors);
		
		var cols = d.cols = 13;
		var data = d.data = [];
		
		for (var i=0; i<cols*cols; i++) {
			data.push(0); // not filled with black
		} 
		
		return d;
	}
	return app;
}(app || {});