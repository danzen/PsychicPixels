
var app = function(app) {

	app.makeController = function(m, v, pages) {
		
		
		// events for pages object (swipes)
		
		pages.on("page", function(e) {			
			if (e.target.page == v.play){
				
			}		
		});
		
		var hs = new zim.HotSpots([
			{page:v.first, rect:v.firstNav.left, 	call:function() {goMenu("right");}},
			{page:v.first, rect:v.firstContent, 	call:function() {goMenu("right");}},
			{page:v.menu,  rect:v.menuTop,	call:function() {pages.go(v.first, "left");}},
			{page:v.menu,  rect:v.menuNav.left, 	call:function() {newDeck();}},
			{page:v.menu,  rect:v.menuDeck, 		call:function() {menuDeck();}},
			{page:v.menu,  rect:v.menuPrev, 		call:function() {menuArrow(-1);}},
			{page:v.menu,  rect:v.menuNext, 		call:function() {menuArrow(1);}},
			{page:v.edit,  rect:v.editNav.right, 	call:function() {goMenu("left");}},
			{page:v.play,  rect:v.playReveal, 		call:function() {reveal();}},
			{page:v.play,  rect:v.playTop, 	call:function() {pages.go(v.menu, "left");}},
			{page:v.play,  rect:v.playNav.left, 	call:function() {score(1);}},
			{page:v.play,  rect:v.playNav.right, 	call:function() {score(0);}},
			{page:v.result,rect:v.resultNav.left, 	call:function() {menuDeck();}},
			{page:v.result,rect:v.resultNav.right, 	call:function() {pages.go(v.menu, "left");}},
			{page:v.result,rect:v.resultTop, 		call:function() {pages.go(v.menu, "left");}},
		]);
		
		function score(n) {
			var randomCard = zim.rand(0,5);
			var randomColor = zim.rand(0,5);
			v.playCard.update(m.currentSet, randomCard, m.colors[randomColor])	
			m.score += n;
			m.tries++;
			
			if (m.tries >= 6) {
				v.resultUpdate();
				pages.go(v.result, "right");
			} else {
				v.playPop.show();
			}
			stage.update();	
		}
		
		function reveal() {
			v.playPop.hide();
			stage.update();
		}
		
		function menuDeck() {
			if (v.menuTabs.selectedIndex == 0) { // play
				m.score = 0;
				m.tries = 0;
				var randomCard = zim.rand(0,5);
				var randomColor = zim.rand(0,5);
				v.playCard.update(m.currentSet, randomCard, m.colors[randomColor]);			
				v.playPop.show();	
				pages.go(v.play, "right");						
			} else if (v.menuTabs.selectedIndex == 1) { // edit
				v.editCard.update(m.currentSet, 0, m.colors[0]); 
				v.setEditButColors();
				pages.go(v.edit, "right");
			} else { // delete
				v.menuConfirm.show();	
				stage.update();		
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
		}

		function newDeck() {
			m.newSet(); 
			zim.shuffle(m.colors);
			v.editCard.update(m.currentSet, 0, m.colors[0]); 
			v.setEditButColors();
			v.menuTabs.selectedIndex = 1;
			pages.go(v.edit, "right");
		}
		
		// events for menu page
		
		v.menuTabs.on("change", function() {
			v.handleArrows();
			v.handleTabs();
			stage.update();			
		});
		
		v.menuConfirmTabs.on("change", function() {
			if (v.menuConfirmTabs.text == "YES") {
				m.removeSet(m.currentSet);					
				if (m.currentSet == 0) v.menuTabs.selectedIndex = 0;	
				v.makeMenuDeck(m.currentSet);
			} 
			v.menuConfirm.hide();	
			stage.update();			
		});

		// events for edit page
		
		var square;
		var currentData;
		var currentColor;
		
		// drawing pixels in edit (next three events)
		v.editCard.squares.on("mousedown", function(e) {
			square = e.target;
			currentData = Math.abs(square.data-1);	
			currentColor = (currentData)?"black":m.colors[m.currentCard];
			square.color = currentColor;
			square.data = currentData;
			square.changed = true;
			stage.update();
		});
		
		v.editCard.squares.on("pressmove", function(e) {
			var data = m.data[m.currentSet][m.currentCard];
			for (var i=0; i<data.length; i++) {
				square = v.editCard.squares.getChildAt(i);
				if (square.changed) continue;
				if (zim.hitTestPoint(square, stage.mouseX, stage.mouseY)) {
					square.color = currentColor;
					square.data = currentData;
					square.changed = true;
					stage.update();
				}
			}
		});
		
		v.editCard.squares.on("pressup", function() {
			var data = m.data[m.currentSet][m.currentCard];
			var newData = [];
			for (var i=0; i<data.length; i++) {
				square = v.editCard.squares.getChildAt(i);
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
			v.editCard.squares.color = color
			v.editCard.update(m.currentSet, m.currentCard, color);
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
			v.editCard.update(m.currentSet, m.currentCard, m.colors[m.currentCard]);
			stage.update();
		});
		
		
	}
	return app;
		
}(app || {});