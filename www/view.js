
var app = function(app) {
	
	app.makeView = function(model, layout) {
		
		var v = {}; // this view object will hold all the pages and we return it
		var m = model; // the data object from model.js
		
////////////////////////////////////
		// Card class for making and updating tiled cards (not used on menu page)
		
		function Card(set, card, color) {
			this.Container_constructor();
			var cols = m.cols; 		
			var size = 100; // square size
			var margin = 1;			
			
			var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
			
			this.addChild(backing);
			
			var squares = this.squares = new createjs.Container();		
			this.addChild(squares);
			squares.x=squares.y=margin;
			
			this.update = function(set, card, color) {
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
			this.update(set, card, color);
			
		}
		createjs.extend(Card, createjs.Container);
		createjs.promote(Card, "Container");
		
////////////////////////////////////
		// result page
		
		var result = v.result = new createjs.Container();
		
		var resultTop = v.resultTop = makeTop();
		result.addChild(resultTop);	

		var resultContent = v.resultContent = new createjs.Container();
		resultContent.addChild(new zim.Rectangle(1000,1000));
		var resultEcho = new createjs.Container();
		resultContent.addChild(resultEcho);
		var resultLab = new zim.Label("test", 140, "homespun", "white");
		resultContent.addChild(resultLab);
		
		v.resultUpdate = function() {
			resultLab.text = m.resultPhrases[m.score];	
			zim.centerReg(resultLab, resultContent);
			resultLab.x-=4;
			resultEcho.removeAllChildren();	
			multiplyText(resultLab, resultEcho, m.score+1);
			zim.centerReg(resultEcho, resultContent);
			resultEcho.x-=4;	
		}		
				
		var resultNav = v.resultNav = makeNav("AGAIN", "MENU");
		result.addChild(resultNav);
		
		result.addChild(resultContent); // added here so pane is modal
		
		var regions = [ 
			{object:resultTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:resultContent, marginTop:5, maxWidth:90, align:"center", valign:"center"},
			{object:resultNav, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		var shape = null; // new createjs.Shape();
		layout.add(new zim.Layout(result, regions, 0, "#ddd", true, shape, stage));
	

////////////////////////////////////
		// play page
		
		var play = v.play = new createjs.Container();
		
		var playTop = v.playTop = makeTop();
		play.addChild(playTop);	

		var playContent = v.playContent = new createjs.Container();

		var playCard = v.playCard = new Card(0,0,"red");
		playContent.addChild(playCard);	
		
		// container, width, height, label, color, drag, resets, modal, corner, etc.
		var playPopLab = new zim.Label("GUESS HIDDEN SHAPE",80 , null, "white");
		var playPop = v.playPop = new zim.Pane(playContent, 1400, 2000, playPopLab, "#000",null,null,null,0,1);
		playPopLab.y -= 150;
		
		var playRevealLab = new zim.Label("REVEAL",80 , null, "white");
		// width, height, label, color, rollColor, borderColor, borderThickness, corner, shadowColor, shadowBlur, hitPadding
		var playReveal = v.playReveal = new zim.Button(400, 150, playRevealLab, "#333", "#555", null, null, 0, null, null, 100);
		playPop.addChild(playReveal);
		zim.centerReg(playReveal);
		playReveal.y = 150;
				
		var playNav = v.playNav = makeNav("RIGHT", "WRONG");
		play.addChild(playNav);
		
		play.addChild(playContent); // added here so pane is modal
		
		var regions = [ 
			{object:playTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:playContent, marginTop:5, maxWidth:90, align:"center", valign:"center"},
			{object:playNav, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		var shape = null; // new createjs.Shape();
		layout.add(new zim.Layout(play, regions, 0, "#ddd", true, shape, stage));
		

////////////////////////////////////
		// menu page
		
		var menu = v.menu = new createjs.Container();
		
		var menuTop = v.menuTop = makeTop();
		menu.addChild(menuTop);	

		var menuContent = v.menuContent = new createjs.Container();
		menuContent.setBounds(0,0,900,1200);
		
		var menuBacking = new zim.Rectangle(900, 1200, "#333");
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
		
		var menuTabs = v.menuTabs = new zim.Tabs(900, 120, tabData);
		menuContent.addChild(menuTabs);
		 
		var menuDeck = v.menuDeck = new createjs.Container();
		menuContent.addChild(menuDeck);
		
		v.makeMenuDeck = function(set) {

			menuDeck.removeAllChildren();
			
			var size = 20;
			var cols = m.cols;
			var width = size*m.cols;
			var tile; var margin=4; var gap=1;
						
			for (var i=0; i<6; i++) {
				tile = new zim.Rectangle(width+margin*2,width+margin*2,"#444");
				menuDeck.addChild(tile);
				tile.x = i%3*width;
				tile.y = Math.floor(i/3)*width;		
				makeTile(tile, set, i, m.colors[i]);
			}
			function makeTile(tile, set, card, color) {
				var square; 
				var data = m.data[set][card];
				for (var i=0; i<data.length; i++) {
					square = new zim.Rectangle(size-gap,size-gap,(data[i])?"black":color);
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
			if (m.data.length - 1 - m.currentSet > 0) {
				menuContent.addChild(menuNext);
			} else {
				menuContent.removeChild(menuNext);
			}
			if (m.currentSet > 1 ) { 
				menuContent.addChild(menuPrev);
			} else if (m.currentSet > 0 && menuTabs.selectedIndex == 0) {
				menuContent.addChild(menuPrev);
			} else {
				menuContent.removeChild(menuPrev);
			}	
		}
		
		v.handleTabs = function() {
			if (m.currentSet == 0) {
				menuTabs.buttons[1].enabled = false;
				menuTabs.buttons[2].enabled = false;
				menuTabs.labels[1].color = "#999";
				menuTabs.labels[2].color = "#999";
			} else {
				if (menuTabs.selectedIndex != 1) menuTabs.buttons[1].enabled = true;
				if (menuTabs.selectedIndex != 2) menuTabs.buttons[2].enabled = true;
				menuTabs.labels[1].color = "white";
				menuTabs.labels[2].color = "white";
			}
		}
		
		v.makeMenuDeck(0);
		
		zim.centerReg(menuDeck, menuBacking);	
		menuDeck.y += 50;

		//menuContent.addChild(new zim.Grid(menuContent, null, false));
		//menuContent.addChild(new zim.Guide(menuContent, false, false))
		
		// container, width, height, label, color, drag, resets, modal, corner, etc.
		var menuConfirmLab = new zim.Label("DELETE DECK?",80 , null, "white");
		var menuConfirm = v.menuConfirm = new zim.Pane(menuContent, 900, 700, menuConfirmLab, "#c00",null,null,null,0);
		menuConfirmLab.y -= 100;
		
		// width, height, tabs, color, rollColor, offColor, auto, spacing, corner, labelAdjust, keyEnabled
		var menuConfirmTabs = v.menuConfirmTabs = new zim.Tabs({width:600, height:150, tabs:[
			{label:new zim.Label("YES", 80, null, "white")}, 
			{label:new zim.Label("NO", 80, null, "white")}
		], auto:false, spacing:20});
		menuConfirm.addChild(menuConfirmTabs);
		zim.centerReg(menuConfirmTabs);
		menuConfirmTabs.y = 100;
		
		var menuNav = v.menuNav = makeNav("NEW", "HELP");
		menu.addChild(menuNav);
		
		menu.addChild(menuContent); // added here so pane is modal
		
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
		
		var editTop = v.editTop = makeTop(false); // only give them a done button
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

		var editContent = new createjs.Container();
		edit.addChild(editContent);
				
		var editCard = v.editCard = new Card(0, 0, color);
		editContent.addChild(editCard);
		editCard.cursor = "pointer";

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
			zim.centerReg(lab);
			lab.x = 47+130; lab.y = 9+19;
			multiplyText(lab, top);
			return top;
		}
		
		function multiplyText(label, holder, num) {
			if (zot(num)) num = 3;
			var lab;
			var pAlpha = new zim.Proportion(1,num,.2,.05);
			for (var i=1; i<=num; i++) {
				lab = label.clone();
				holder.addChild(lab);
				zim.centerReg(lab);
				lab.x = label.x; lab.y = label.y;
				lab.scaleY = .7+.9*i;
				lab.alpha = pAlpha.convert(i);
			}			
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