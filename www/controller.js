
var app = function(app) {

	app.makeController = function(m, v, pages) {
		
		
		// events for pages object (swipes)
		
		pages.on("page", function(e) {			
			if (e.target.page == v.edit){
					
			}		
		});
		
		var hs = new zim.HotSpots([
			{page:v.first, rect:v.firstNav.left, 	call:function() {goMenu("right");}},
			{page:v.first, rect:v.firstContent, 	call:function() {goMenu("right");}},
			{page:v.menu,  rect:v.menuTop.button,	call:function() {pages.go(v.first, "left");}},
			{page:v.menu,  rect:v.menuNav.left, 	call:function() {newDeck();}},
			{page:v.menu,  rect:v.menuDeck, 		call:function() {menuDeck();}},
			{page:v.menu,  rect:v.menuPrev, 		call:function() {menuArrow(-1);}},
			{page:v.menu,  rect:v.menuNext, 		call:function() {menuArrow(1);}},
			{page:v.edit,  rect:v.editTop.button, 	call:function() {goMenu("left");}}
		]);
		
		function menuDeck() {
			if (v.editTabs.selectedIndex == 0) {
				zog("play");
			} else if (v.editTabs.selectedIndex == 1) {
				v.makeSquares(m.currentSet, 0, m.colors[0]); 
				v.setEditButColors();
				pages.go(v.edit, "right");
			} else {
				zog("delete");				
			}			
		}
		
		function goMenu(direction) {
			v.makeMenuDeck(m.currentSet);
			pages.go(v.menu, direction);
		}
		
		function menuArrow(direction) {
			m.currentSet += direction;
			m.currentSet = Math.min(Math.max(m.currentSet, 0), m.data.length-1);
			zim.shuffle(m.colors);
			v.makeMenuDeck(m.currentSet);
			stage.update();
		}

		function newDeck() {
			m.newSet(); 
			zim.shuffle(m.colors);
			v.makeSquares(m.currentSet, 0, m.colors[0]); 
			v.setEditButColors();
			pages.go(v.edit, "right");
		}
		
		// events for menu page
		
		v.editTabs.on("change", function() {
			v.handleArrows();
			v.handleTabs();
			stage.update();
		});

		// events for edit page
		
		var square;
		var currentData;
		var currentColor;
		
		// drawing pixels in edit (next three events)
		v.squares.on("mousedown", function(e) {
			square = e.target;
			currentData = Math.abs(square.data-1);	
			currentColor = (currentData)?"black":m.colors[m.currentCard];
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
		
		// change cards in edit
		var but; var color;
		v.editButs.on("mousedown", function(e) {
			but = e.target;
			m.currentCard = but.num;
			color = m.colors[but.num];
			v.squares.color = color
			v.makeSquares(m.currentSet, m.currentCard, color);
			stage.update();	
		});
		
		// clear in edit
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
		
		// done in edit
		v.editNav.right.on("click", function() {
			zog(JSON.stringify(m.data));
		});
		
	}
	return app;
		
}(app || {});