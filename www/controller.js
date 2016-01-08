
var app = function(app) {

	app.makeController = function(model, view) {
		
		var v = view; // our pages
		var m = model; // our data

		// events for edit page
		
		var square;
		var currentData;
		var currentColor;
		
		v.squares.on("mousedown", function(e) {
			square = e.target;
			currentData = Math.abs(square.data-1);	
			currentColor = (currentData)?"black":v.squares.color;
			square.color = currentColor;
			square.data = currentData;
			square.changed = true;
			stage.update();
		});
		
		v.squares.on("pressmove", function(e) {
			var data = m.data[m.currentSet][m.currentCard];
			for (var i=0; i<data.length; i++) {
				square = v.squares.getChildAt(i);
				if (square.changed) continue;
				if (zim.hitTestPoint(square, stage.mouseX, stage.mouseY)) {
					square.color = currentColor;
					square.data = currentData;
					square.changed = true;
					stage.update();
				}
			}
		});
		
		v.squares.on("pressup", function() {
			var data = m.data[m.currentSet][m.currentCard];
			var newData = [];
			for (var i=0; i<data.length; i++) {
				square = v.squares.getChildAt(i);
				square.changed = false;
				newData.push(square.data);
			}
			m.save(newData);
		});
		
		var but; var color;
		v.editButs.on("click", function(e) {
			but = e.target;
			m.currentCard = but.num;
			color = m.colors[but.num];
			v.squares.color = color
			stage.canvas.style.backgroundColor = color;
			v.makeSquares(0, but.num, color);
			stage.update();	
		});
		
		v.editNav.left.on("click", function() {
			var data = m.data[m.currentSet][m.currentCard];
			var newData = [];
			for (var i=0; i<data.length; i++) {
				newData.push(0);
			}
			m.save(newData);
			v.makeSquares(m.currentSet, m.currentCard, v.squares.color);
			stage.update();
		});
		
		v.editNav.right.on("click", function() {
			zog(JSON.stringify(m.data));
		});
		
	}
	return app;
		
}(app || {});