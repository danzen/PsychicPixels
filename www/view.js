
var app = function(app) {
	
	app.makeView = function(model, layout) {
		
		var v = {}; // this view object will hold all the pages and we return it
		var m = model; // the data object from model.js


////////////////////////////////////
		// menu page
	
				
		var menu = v.menu = new createjs.Container();
		
		var menuTop = v.menuTop = makeTop();
		menu.addChild(menuTop);	
		
		
		var menuContent = v.menuContent = new createjs.Container();
		menuContent.setBounds(0,0,900,1200);
		menu.addChild(menuContent);
		
		var menuBacking = v.menuBacking = new zim.Rectangle(900, 1200, "#333");
		menuContent.addChild(menuBacking);	
		
		var menuPrev = v.menuPrev = new zim.Triangle(200,150,150,"#BBB");
		zim.expand(menuPrev, 150, 50);
		menuPrev.x = menuBacking.width / 2;
		menuPrev.y = 265;
		
		var menuNext = v.menuNext = new zim.Triangle(200,150,150,"#BBB");
		zim.expand(menuNext, 150, 50);
		menuNext.rotation = 180;		
		menuNext.x = menuBacking.width / 2;
		menuNext.y = 1040;
		
		var tabData = [		
			{label:new zim.Label("PLAY", 70, null, "white")},
			{label:new zim.Label("EDIT", 70, null, "white")},
			{label:new zim.Label("DELE", 70, null, "white")}
		];
		
		var editTabs = v.editTabs = new zim.Tabs(900, 120, tabData);
		menuContent.addChild(editTabs);
		 
		var menuDeck = v.menuDeck = new createjs.Container();
		menuContent.addChild(menuDeck);
		
		v.makeMenuDeck = function(set) {
			var size = 20;
			var cols = m.cols;
			var width = size*m.cols;
			var tile; var margin=4;
			menuDeck.removeAllChildren();
			for (var i=0; i<6; i++) {
				tile = new zim.Rectangle(width+margin*2,width+margin*2,"#333");
				menuDeck.addChild(tile);
				tile.x = i%3*width;
				tile.y = Math.floor(i/3)*width;		
				makeTile(tile, set, i, m.colors[i]);
			}
			function makeTile(tile, set, card, color) {
				var square; 
				var data = m.data[set][card];
				for (var i=0; i<data.length; i++) {
					square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
					square.data = data[i];
					tile.addChild(square);
					square.x = i%cols*size+margin;
					square.y = Math.floor(i/cols)*size+margin;
				}
			}
			v.handleArrows();
			v.handleTabs();
			stage.update();
		}
		
		v.handleArrows = function() {
			// arrows
			if (m.data.length - 1 - m.currentSet > 0) {
				menuContent.addChild(menuNext);
			} else {
				menuContent.removeChild(menuNext);
			}
			if (m.currentSet > 1 ) { 
				menuContent.addChild(menuPrev);
			} else if (m.currentSet > 0 && editTabs.selectedIndex == 0) {
				menuContent.addChild(menuPrev);
			} else {
				menuContent.removeChild(menuPrev);
			}	
		}
		
		v.handleTabs = function() {
			// tabs
			if (m.currentSet == 0) {
				editTabs.buttons[1].enabled = false;
				editTabs.buttons[2].enabled = false;
				editTabs.labels[1].color = "#999";
				editTabs.labels[2].color = "#999";
			} else {
				if (editTabs.selectedIndex != 1) editTabs.buttons[1].enabled = true;
				if (editTabs.selectedIndex != 2) editTabs.buttons[2].enabled = true;
				editTabs.labels[1].color = "white";
				editTabs.labels[2].color = "white";
			}
		}
		
		v.makeMenuDeck(0);
		
		zim.centerReg(menuDeck, menuBacking);	
		menuDeck.y += 50;	


			
		
		
		//menuContent.addChild(new zim.Grid(menuContent, null, false));
		//menuContent.addChild(new zim.Guide(menuContent, false, false));
		


		var menuNav = v.menuNav = makeNav("NEW", "HELP");
		menu.addChild(menuNav);
		
		var regions = [ 
			{object:menuTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:menuContent, marginTop:5, maxWidth:90, align:"center", valign:"center"},
			{object:menuNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(menu, regions, 0, "#ddd", true, null, stage));

		//stage.addChild(new zim.Grid(menu));
		
////////////////////////////////////
		// first page
	
				
		var first = v.first = new createjs.Container();
		
		var firstTop = v.firstTop = makeTop(false); // no back arrow
		first.addChild(firstTop);	
		
		
		var firstContent = v.firstContent = new createjs.Container();
		first.addChild(firstContent);
		var size = 50;
		var cols = m.cols;
		var width = size*m.cols;
		var tile; var margin=6;
		for (var i=0; i<6; i++) {
			tile = new zim.Rectangle(width+margin*2,width+margin*2,"#333");
			firstContent.addChild(tile);
			tile.x = i%2*width;
			tile.y = Math.floor(i/2)*width;		
			makeTile(tile, 0, i, m.colors[i]);
 		}
		function makeTile(holder, set, card, color) {
			var square; 
			var data = m.data[set][card];
			for (var i=0; i<data.length; i++) {
				square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
				square.data = data[i];
				holder.addChild(square);
				square.x = i%cols*size+margin;
				square.y = Math.floor(i/cols)*size+margin;
			}
		}
		

		var firstNav = v.firstNav = makeNav("START", "HELP");
		first.addChild(firstNav);
		
		var regions = [ 
			{object:firstTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:firstContent, marginTop:5, maxWidth:90, align:"center", valign:"center"},
			{object:firstNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(first, regions, 0, "#ddd", true, null, stage));

		
		
////////////////////////////////////
		// edit page
		
		var color = m.colors[0];
				
		var edit = v.edit = new createjs.Container();
		
		var editTop = v.editTop = makeTop();
		edit.addChild(editTop);
		
		var editBar = new createjs.Container();
		editBar.setBounds(0,0,400,51);
		edit.addChild(editBar);
		
		var editSub = new zim.Label("CARDS", 20, null, "white");
		editSub.x = 14;
		editSub.y = 18;
		editBar.addChild(editSub);
		
		var editButs = v.editButs = new createjs.Container();
		var butColor; var but; var lab;
		for (var i=0; i<6; i++) {
			lab = new zim.Label(String(i+1), null, null, "#444", "white");
			but = new zim.Button(49, 49, lab, "#222", "#333", null, 0, 0, -1);
			but.num = i;
			editButs.addChild(but);
			but.x = i*50;
		}
		editButs.x = 100;
		editButs.y = 1;
		editBar.addChild(editButs);
		v.setEditButColors = function() {
			for (var i=0; i<6; i++) {
				but = editButs.getChildAt(i);
				but.color = m.colors[i];
			}
			stage.update();
		}
		v.setEditButColors();
				 
		var cols = m.cols; 		
		var size = 100; // square size
		var margin = 1;
		
		var editContent = new createjs.Container();
		edit.addChild(editContent);
		
		var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
		editContent.addChild(backing);
		
		var squares = v.squares = new createjs.Container();
		squares.cursor="pointer";
		squares.color = color;
		editContent.addChild(squares);
		squares.x=squares.y=margin;
		
		v.makeSquares = function(set, card, color) {
			squares.removeAllChildren();
			var square; 
			var data = m.data[set][card];
			for (var i=0; i<data.length; i++) {
				square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
				square.data = data[i];
				squares.addChild(square);
				square.changed = false;
				square.x = i%cols*size;
				square.y = Math.floor(i/cols)*size;
			}
		}
		
		v.makeSquares(0, 0, color); // controller also makes squares so store on p
		
		var editNav = v.editNav = makeNav("CLEAR", "DONE");
		edit.addChild(editNav);
		
		var regions = [ 
			{object:editTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:editBar, marginTop:2, maxWidth:100, height:7, align:"right", valign:"middle", backgroundColor:"#000"},
			{object:editContent, marginTop:2, maxWidth:90, align:"center", valign:"top"},
			{object:editNav, marginTop:2, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(edit, regions, 0, "#ddd", true, null, stage));

		// edit.addChild(new zim.Guide(edit));

		// general functions
		
		function makeTop(backButton) {
			if (zot(backButton)) backButton = true;
			var top = new createjs.Container();
			top.setBounds(0,0,350,50);
			if (backButton) {
				top.button = new zim.Triangle(30,30,30,"rgba(0,0,0,.4)");
				top.button.rotation = -90;
				top.button.x = 19;
				top.button.y = 28;
				top.addChild(top.button);
				zim.expand(top.button);
			}
			var lab = zim.Label("PSYCHIC·PIXELS",40,"homespun","#222");
			top.addChild(lab);
			lab.x = 47; lab.y = 9;
			var lab2 = zim.Label("PSYCHIC·PIXELS",40,"homespun","#222");
			top.addChild(lab2);
			lab2.x = 47; lab2.y = -3;
			lab2.scaleY = 1.6;
			lab2.alpha = .2;
			var lab3 = zim.Label("PSYCHIC·PIXELS",40,"homespun","#222");
			top.addChild(lab3);
			lab3.x = 47; lab3.y = -20;
			lab3.scaleY = 2.5;
			lab3.alpha = .1;
			var lab4 = zim.Label("PSYCHIC·PIXELS",40,"homespun","#222");
			top.addChild(lab4);
			lab4.x = 47; lab4.y = -34;
			lab4.scaleY = 3.3;
			lab4.alpha = .05;
			return top;
		}
		
		function makeNav(left, right) {
			var nav = new createjs.Container();			
			// var editClearLabel = new zim.Label("CLEAR", null, null, "white");
			// width, height, label, color, rollColor, borderColor, borderThickness, corner, shadowColor
			nav.left = new zim.Button(200, 70, left, "#222", "#444", null, 0, 0, -1);
			nav.addChild(nav.left);
			nav.right = new zim.Button(200, 70, right, "#222", "#444", null, 0, 0, -1);
			nav.addChild(nav.right);
			nav.right.x = nav.left.width+2;
			return nav;
		}
		
		return v;
	}
	return app;
}(app || {});