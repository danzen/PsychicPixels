
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
			currentColor = (currentData)?"black":p.squares.color;
			square.color = currentColor;
			square.data = currentData;
			square.changed = true;
			stage.update();
		});
		
		p.squares.on("pressmove", function(e) {
			var data = d.data[d.currentSet][d.currentCard];
			for (var i=0; i<data.length; i++) {
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
			var data = d.data[d.currentSet][d.currentCard];
			var newData = [];
			for (var i=0; i<data.length; i++) {
				square = p.squares.getChildAt(i);
				square.changed = false;
				newData.push(square.data);
			}
			d.save(newData);
		});
		
		var but; var color;
		p.editButs.on("click", function(e) {
			but = e.target;
			d.currentCard = but.num;
			color = d.colors[but.num];
			p.squares.color = color
			stage.canvas.style.backgroundColor = color;
			p.makeSquares(0, but.num, color);
			stage.update();	
		});
		
		p.editClear.on("click", function() {
			var data = d.data[d.currentSet][d.currentCard];
			var newData = [];
			for (var i=0; i<data.length; i++) {
				newData.push(0);
			}
			d.save(newData);
			p.makeSquares(d.currentSet, d.currentCard, p.squares.color);
			stage.update();
		});
		
		p.editDone.on("click", function() {
			zog(JSON.stringify(d.data));
		});
		
	}
	return app;
		
}(app || {});