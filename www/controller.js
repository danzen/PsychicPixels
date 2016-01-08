
var app = function(app) {

	app.makeController = function(m, v, pages) {
		
		
		// events on pages object
		
		pages.on("page", function(e) {			
			if (e.target.page == v.help){
				v.helpAnimate();
			}	
			if (e.target.page == v.about){
				v.aboutAnimate()	
			}		
			if (e.target.lastPage == v.help){
				v.helpAnimate(false);
			}	
			if (e.target.lastPage == v.about){
				v.aboutAnimate(false);	
			}			
		});
		
		var hs = new zim.HotSpots([
			
			{page:v.first, rect:v.firstContent, 	call:function() {goMenu("right");}},
			{page:v.first, rect:v.firstNav.left, 	call:function() {goMenu("right");}},
			{page:v.first, rect:v.firstNav.right, 	call:function() {pages.go(v.help, "right");}},
			
			{page:v.menu,  rect:v.menuTop,			call:function() {pages.go(v.first, "left");}},
			{page:v.menu,  rect:v.menuPrev, 		call:function() {menuArrow(-1);}},
			{page:v.menu,  rect:v.menuNext, 		call:function() {menuArrow(1);}},
			{page:v.menu,  rect:v.menuNav.left, 	call:function() {newDeck();}},
			{page:v.menu,  rect:v.menuNav.right, 	call:function() {pages.go(v.help, "right");}},
			
			{page:v.edit,  rect:v.editTop, 			call:function() {goMenu("left");}},
			{page:v.edit,  rect:v.editNav.right, 	call:function() {goMenu("left");}},			
			
			{page:v.play,  rect:v.playTop, 			call:function() {goMenu("left")}},
			{page:v.play,  rect:v.playReveal, 		call:function() {reveal();}},
			{page:v.play,  rect:v.playNav.left, 	call:function() {score(1);}},
			{page:v.play,  rect:v.playNav.right, 	call:function() {score(0);}},
			
			{page:v.result,rect:v.resultTop, 		call:function() {pages.go(v.menu, "left");}},
			{page:v.result,rect:v.resultNav.left, 	call:function() {menuDeck();}},
			{page:v.result,rect:v.resultNav.right, 	call:function() {pages.go(v.menu, "left");}},
			
			{page:v.help,	rect:v.helpTop,		 	call:function() {goMenu("right");}},
			{page:v.help,	rect:v.helpNav.left, 	call:function() {goMenu("right");}},
			{page:v.help,	rect:v.helpContent, 	call:function() {goMenu("right");}},
			{page:v.help,	rect:v.helpNav.right, 	call:function() {pages.go(v.about, "right");}},
			
			{page:v.about,	rect:v.aboutTop,		call:function() {pages.go(v.help, "left");}},
			{page:v.about,	rect:v.aboutContent, 	call:function() {zog("danzen");}},
			{page:v.about,	rect:v.aboutNav.left, 	call:function() {goMenu("right");}},
			{page:v.about,	rect:v.aboutNav.right, 	call:function() {pages.go(v.help, "left");}}
			
		]);
		
		// Events for play
		
		function score(n) {
			m.currentCard = zim.rand(0,5);
			zim.shuffle(m.colors);
			v.playCard.update()	;
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
		
		
		// events for menu
				
		function menuDeck() {
			if (v.menuTabs.selectedIndex == 0) { // play
				m.score = 0;
				m.tries = 0;
				m.currentCard = zim.rand(0,5);
				zim.shuffle(m.colors);
				v.playCard.update();			
				v.playPop.show();	
				pages.go(v.play, "right");						
			} else if (v.menuTabs.selectedIndex == 1) { // edit
				m.currentCard = 0;
				var index = zim.hitTestGrid(
						v.menuDeck, v.menuDeck.getBounds().width, v.menuDeck.getBounds().height, 
						3, 2, stage.mouseX, stage.mouseY
				);
				if (!zot(index)) m.currentCard = index;
				v.editCard.update(); 
				v.setEditButColors();
				pages.go(v.edit, "right");
			} else { // delete
				v.menuConfirm.show();	
				stage.update();		
			}			
		}

		function goMenu(direction) {		
			v.makeMenuDeck();
			pages.go(v.menu, direction);
		}
		
		function menuArrow(direction) {
			m.currentSet += direction;
			m.currentSet = Math.min(Math.max(m.currentSet, 0), m.data.length-1);
			zim.shuffle(m.colors);
			v.makeMenuDeck();
		}

		function newDeck() {
			m.newSet(); 
			zim.shuffle(m.colors);
			v.editCard.update(); 
			v.setEditButColors();
			v.menuTabs.selectedIndex = 1;
			pages.go(v.edit, "right");
		}
		
		// hard coded events for menu
		
		v.menuDeck.on("click", function() {
			menuDeck();
		});
		
		v.menuDeckSwipe.on("swipe", function(e) {			
			if (e.target.direction == "up" && v.menuContent.contains(v.menuNext)) {
				menuArrow(1);
			} else if (e.target.direction == "down" && v.menuContent.contains(v.menuPrev)) {
				menuArrow(-1);
			} else if (e.target.direction == "left") {
				menuDeck();
			}
			zop(e);
		});
		
		v.menuTabs.on("change", function() {
			v.handleArrows();
			v.handleTabs();
			stage.update();			
		});
		
		v.menuConfirmTabs.on("change", function() {
			if (v.menuConfirmTabs.text == "YES") {
				m.removeSet(m.currentSet);					
				if (m.currentSet == 0) v.menuTabs.selectedIndex = 0;	
				v.makeMenuDeck();
			} 
			v.menuConfirm.hide();	
			stage.update();			
		});


		// events for edit page
		
		var square;
		var currentData;
		var currentDraw; // 0 or 1 for current draw
		
		// drawing pixels in edit (next three events)
		v.editCard.on("mousedown", function(e) {
			var index = getSquare(); // runs a zim.hitTestGrid() for mouseX and mouseY
			if (zot(index)) return;
			currentData = m.data[m.currentSet][m.currentCard];
			currentDraw = currentData[index] = Math.abs(currentData[index]-1); // flip the 0 and 1
			setColor(index);
		});
		
		v.editCard.on("pressmove", function(e) {
			var index = getSquare(); // runs a zim.hitTestGrid() for mouseX and mouseY
			if (zot(index) || v.editCard.changed[index]) return; // already changed
			setColor(index);

			// old way with hitTests was quite laggy on mobile
			/*for (var i=0; i<data.length; i++) {
				square = v.editCard.squares.getChildAt(i);
				if (square.changed) continue;
				if (zim.hitTestPoint(square, stage.mouseX, stage.mouseY)) {
					square.color = currentColor;
					square.data = currentData;
					square.changed = true;
					stage.update();
				}
			}*/						
		});
		
		function setColor(index) {
			currentData[index] = currentDraw;
			v.editCard.setColor(index);
			v.editCard.changed[index] = 1;
			stage.update();
		}
		
		function getSquare() {
			
			// plan for right handed and people like to see under finger
			// so offset finger press a little - did testing, 8/100 seemed good
			// remember, this is scaled down
			
			// added below to a zim.hitTestGrid() function so no longer used
			// var point = v.editCard.squares.globalToLocal(stage.mouseX-8, stage.mouseY-8);
			// var col = Math.min(m.cols-1,Math.max(0,Math.floor(point.x/v.editCard.size)));
			// var row = Math.min(m.cols-1,Math.max(0,Math.floor(point.y/v.editCard.size)));			
			// var squareNum = row*m.cols + col;
			// return v.editCard.squares.getChildAt(squareNum);
			
			return zim.hitTestGrid(
					v.editCard, v.editCard.width, v.editCard.height, 
					m.cols, m.cols, stage.mouseX-8, stage.mouseY-8
			);
		}
		
		v.editCard.on("pressup", function() {
			v.editCard.resetChanged();
			m.save();
		});
		
		// change cards in edit
		var but; var color;
		v.editButs.on("mousedown", function(e) {
			but = e.target;
			m.currentCard = but.num;
			v.editCard.update();
			stage.update();	
		});
		
		// clear in edit
		v.editNav.left.on("mousedown", function(e) {
			var data = m.data[m.currentSet][m.currentCard];			
			for (var i=0; i<data.length; i++) {
				data[i]=0;
			}
			m.save();
			v.editCard.update();
			stage.update();
		});
		
		
	}
	return app;
		
}(app || {});