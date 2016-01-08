
var app = function(app) {

	app.makeController = function(model, view) {
		
		var p = view; // our pages
		var d = model; // our data
		
		
		// events for edit page
		
		var square;
		var currentData;
		var currentColor;
		
		p.squares.on("mousedown", function(e) {
			square = e.target;
			currentData = Math.abs(square.data-1);	
			currentColor = (currentData)?"black":"yellow"
			square.color = currentColor;
			square.data = currentData;
			square.changed = true;
			stage.update();
		});
		
		p.squares.on("pressmove", function(e) {
			for (var i=0; i<d.data.length; i++) {
				square = p.squares.getChildAt(i);
				if (square.changed) continue;
				if (zim.hitTestPoint(square, stage.mouseX, stage.mouseY)) {
					square.color = currentColor;
					square.data = currentData;
					square.changed = true;
					stage.update();
				}
			}
		});
		
		p.squares.on("pressup", function() {
			for (var i=0; i<d.data.length; i++) {
				square = p.squares.getChildAt(i);
				square.changed = false;
			}
		});
	}
	return app;
		
}(app || {});