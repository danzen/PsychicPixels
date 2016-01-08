
var app = function(app) {
	
	app.makeView = function(model) {
		
		var p = {}; // this object will hold all the pages and we return it
		var d = model; // the data object from model.js

		// make edit page
		
		var edit = p.edit = new createjs.Container();
				
		var data = d.data;		 
		var cols = d.cols; 
		
		var size = 100; // square size
		var margin = 1;
		
		var box = new createjs.Container();
		edit.addChild(box);
		
		var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
		box.addChild(backing);
		
		var squares = p.squares = new createjs.Container();
		box.addChild(squares);
		squares.x=squares.y=margin;
		
		var square; var color;
		for (var i=0; i<data.length; i++) {
			square = new zim.Rectangle(99,99,(data[i])?"black":"yellow");
			square.data = data[i];
			squares.addChild(square);
			square.changed = false;
			square.x = i%cols*100;
			square.y = Math.floor(i/cols)*100;
		}

		return p;
	}
	return app;
}(app || {});