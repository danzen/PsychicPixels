
var app = function(app) {

	app.makeController = function(m, v, pages) {
		
		
		// events for pages object (swipes)
		
		pages.on("page", function(e) {			
			if (e.target.page == v.edit){
					
			}		
		});
		
		var hs = new zim.HotSpots([
			{page:v.first, rect:v.firstNav.left, call:function() {pages.go(v.menu, "right");}},
			{page:v.first, rect:v.firstContent, call:function() {pages.go(v.menu, "right");}},
			{page:v.menu,  rect:v.menuTop.button, call:function() {pages.go(v.first, "left");}},
			{page:v.menu,  rect:v.menuNav.left, call:function() {pages.go(v.edit, "right");}},
			{page:v.menu,  rect:v.menuDeck, call:function() {pages.go(v.edit, "right");}},
			{page:v.edit,  rect:v.editTop.button, call:function() {pages.go(v.menu, "left");}}
		]);

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
		v.editButs.on("mousedown", function(e) {
			but = e.target;
			m.currentCard = but.num;
			color = m.colors[but.num];
			v.squares.color = color
			v.makeSquares(0, but.num, color);
			stage.update();	
		});
		
		v.editNav.left.on("mousedown", function() {
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