
var app = function(app) {
	
	app.makeView = function(m, layouts) { // m is model
		
		var v = {}; // this view object will hold all the pages and we return it

////////////////////////////////////
		// Card class for making and updating tiled cards 
		// extends a createjs.Shape in a manner provided by createjs
		// Card takes the data from m.data unless a data array is passed to it
		// we pass a data array to Card for the help and about section
		
		function Card(size, margin, color, data) {
			var duo; if (duo = zob(Card, arguments, null, this)) return duo; // see ZIM duo
			this.Shape_constructor(); // this is provided by the createjs.promote method below
		
			if (zot(size)) size = 100;
			if (zot(margin)) margin = 1;
			
			if (zot(color)) color = m.colors[m.currentCard];
			if (zot(data)) data = m.data[m.currentSet][m.currentCard];
			
			var that = this;
					
			this.size = size; // store square size as property for outside access
			this.changed = []; // used in controller
				
			var cols = m.cols;	
			this.width = this.height = cols*size+margin*2-1;
			this.setBounds(0,0,this.width,this.height);
						
			this.update = function(newColor, newData) { // method used by controller to update pictures

				if (zot(newColor)) newColor = m.colors[m.currentCard]; 	
				if (zot(newData)) newData = m.data[m.currentSet][m.currentCard];
				
				var g = that.graphics;			
				g.clear();
				g.f("#444").r(0,0,that.width,that.height);
				var x; var y;
				for (var i=0; i<data.length; i++) {
					that.changed[i] = 0; // used by controller to handle setting rollover color once per press down
					x = i%cols*size; // tile columns
					y = Math.floor(i/cols)*size; // tile rows
					g.f((newData[i])?"black":newColor).r(x+margin,y+margin,size-1,size-1);
				}
			}			
			this.update(color, data);
			
			this.resetChanged = function() {
				for (var i=0; i<that.changed.length; i++) {
					that.changed[i] = 0;
				}
			}
			
			this.setColor = function(index, newColor) {			
				// notice a little bleed on desktops - fine on mobile
				// so if this were not mobile I would redraw the whole card
				var data = m.data[m.currentSet][m.currentCard];
				var x; var y; var co
				x = index%cols*size; 
				y = Math.floor(index/cols)*size;
				if (zot(newColor)) newColor = (data[index])?"black":m.colors[m.currentCard];
				that.graphics.f(newColor).r(x+margin,y+margin,size-1,size-1);
			}
			
		}
		createjs.extend(Card, createjs.Shape); // for some reason gave error if put below where we use the class
		createjs.promote(Card, "Shape");


// STRATEGY
// the view script is where we make the layouts for the pages
// generally, each page has a top, content and bottom
// for the zim Pages and Layout classes, the most simple way is to fully make each page
// if you have an app where the top never changes, then you can put all your pages in a container
// and leave the top as a single object (unless you are animating your transitions)

// so, each page here uses a function (bottom of script) to make a top and a nav (bottom)
// and then the content varies from page to page
// all these are containers and get added to a zim.Layout 
// all the zim.Layout objects are added to a zim.LayoutManager (layouts) passed in from the main script
// the main script then resizes the layout manager to handle different screen sizes
// see ZIM Pages module for another example of this along with orientation changes


////////////////////////////////////
		// first page
	
		// the technique used here and below is to keep a local variable for legibility
		// but also, for any object needed outside this function, we store it on the view object (v)
		// v then gets returned to the main script and passed into the controller
		// that way, the controller can operate on things in the view
			
		var first = v.first = new createjs.Container();
		
		var firstTop = v.firstTop = makeTop(false); // no back arrow
		first.addChild(firstTop);	
	
		var firstContent = v.firstContent = new createjs.Container();
		first.addChild(firstContent);
		
		function makeFirstDeck() {
			var card; var margin = 6; var size = 50;
			m.currentSet = 0;
			for (var i=0; i<6; i++) {
				m.currentCard = i;
				card = new Card(size, margin);
				card.x = i%2*(card.width-margin);
				card.y = Math.floor(i/2)*(card.height-margin);	
				firstContent.addChild(card);
			}
		}
		makeFirstDeck();
		
		var firstNav = v.firstNav = makeNav("START", "HELP");
		first.addChild(firstNav);
		
		var regions = [ 
			{object:firstTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:firstContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:firstNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		var shape = null; // new createjs.Shape(); // set to Shape to see bounding boxes in Layout
		layouts.add(new zim.Layout(first, regions, 0, null, true, shape, stage));
		
		
		
////////////////////////////////////
		// help page
	
				
		var help = v.help = new createjs.Container();
		
		var helpTop = v.helpTop = makeTop(false);
		help.addChild(helpTop);	
	
		var helpContent = v.helpContent = new createjs.Container();		
		help.addChild(helpContent);
		var helpBacking = new zim.Rectangle(1000,1300);
		helpContent.addChild(helpBacking);
		
		var helpMarginH = 60;
		var helpMarginV = 120;
		
		var helpPredictLab = new zim.Label("PREDICT",70,null,"#DDD");
		helpContent.addChild(helpPredictLab);
		helpPredictLab.x = 210;
		helpPredictLab.y = 30;
		
		var helpPerceiveLab = new zim.Label("PERCEIVE",70,null,"#DDD");
		helpContent.addChild(helpPerceiveLab);
		helpPerceiveLab.x = 475;
		helpPerceiveLab.y = helpBacking.height-90;
		
		var helpESPLab = new zim.Label("ESP",170,null,"#111");
		helpContent.addChild(helpESPLab);
		helpESPLab.rotation = -90;
		helpESPLab.x = 100;
		helpESPLab.y = 1140;
		
		//helpContent.addChild(new zim.Grid(helpContent));

		zim.shuffle(m.helpColors);
		var helpSingle = new Card({color:m.helpColors[0], data:m.single});
		helpContent.addChild(helpSingle);
		zim.scaleTo(helpSingle, helpBacking, null, 46);
		helpSingle.x = helpMarginH;
		helpSingle.y = helpMarginV;
		
		var helpDouble = new Card({color:m.helpColors[1], data:m.double});
		helpContent.addChild(helpDouble);
		zim.scaleTo(helpDouble, helpBacking, null, 46);
		helpDouble.x = helpBacking.width-helpMarginH-helpDouble.getBounds().width*helpDouble.scaleX;
		helpDouble.y = helpBacking.height-helpMarginV-helpDouble.getBounds().height*helpDouble.scaleY;
		
		var singleList = [29,18,20,35,62,87];
		var doubleList = [28,17,19,21,36];
		singleList.reverse();
		var helpInterval; var helpCount; var helpSingleCount; var helpDoubleCount;
		v.helpAnimate = function(type) {
			if (zot(type)) type = true;
			if (type) {
				for (var i=0; i<singleList.length; i++) {
					helpSingle.setColor(singleList[i],"black"); 
				}
				for (i=0; i<doubleList.length; i++) {
					helpDouble.setColor(doubleList[i],"black"); 
				}
				helpCount = helpSingleCount = helpDoubleCount = 0;
				var lastSingleCount = lastDoubleCount = 0;
				helpInterval = setInterval(function() {
					helpCount++;
					if (helpCount%2==0) {
						helpSingle.setColor(singleList[lastSingleCount],"black");
						helpSingle.setColor(singleList[helpSingleCount],"white");
						lastSingleCount = helpSingleCount;
						helpSingleCount++;					
						if (helpSingleCount > singleList.length-1) helpSingleCount = 0;
					} else {
						helpDouble.setColor(doubleList[lastDoubleCount],"black");
						helpDouble.setColor(doubleList[helpDoubleCount],"white");
						lastDoubleCount = helpDoubleCount;
						helpDoubleCount++;					
						if (helpDoubleCount > doubleList.length-1) helpDoubleCount = 0;
					}
					stage.update();
				}, 200);				
				stage.update();
			} else {
				clearInterval(helpInterval);
			}
		}

		var helpNav = v.helpNav = makeNav("START", "ABOUT");
		help.addChild(helpNav);
		
		var regions = [ 
			{object:helpTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:helpContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:helpNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layouts.add(new zim.Layout(help, regions, 0, null, true, null, stage));
		
		
		
////////////////////////////////////
		// about page
	
				
		var about = v.about = new createjs.Container();
		
		var aboutTop = v.aboutTop = makeTop(false);
		about.addChild(aboutTop);	
	
		var aboutContent = v.aboutContent = new createjs.Container();		
		about.addChild(aboutContent);
		var aboutBacking = new zim.Rectangle(1000,1300);
		aboutContent.addChild(aboutBacking);
		
		var danzenColor = m.helpColors[2];
		var aboutDanzen = new Card({color:danzenColor, data:m.danzen});
		aboutContent.addChild(aboutDanzen);
		zim.scaleTo(aboutDanzen, aboutBacking, 80, 80);
		
		zim.centerReg(aboutDanzen, aboutBacking);
		aboutDanzen.y -= 100;
		
		var aboutDanzenLab = new zim.Label("danzen.com",70,null,"#DDD");
		aboutContent.addChild(aboutDanzenLab);
		zim.centerReg(aboutDanzenLab, aboutBacking);
		aboutDanzenLab.y += 440;

		var aboutInterval; var aboutCount; 
		v.aboutAnimate = function(type) {
			if (zot(type)) type = true;
			if (type) {
				aboutCount = 0; var color; var otherColor;
				aboutInterval = setInterval(function() {
					if (aboutCount%2==0) {
						color = "black";
						otherColor = danzenColor;
					} else {
						color = danzenColor;	
						otherColor = "black";
					}					
					aboutDanzen.setColor(44, color);
					aboutDanzen.setColor(58, otherColor);
					aboutCount++;
					stage.update();
				}, 700);				
				stage.update();
			} else {
				clearInterval(aboutInterval);
			}
		}
		
		// aboutContent.addChild(new zim.Grid(aboutContent,null,false));

		var aboutNav = v.aboutNav = makeNav("START", "HELP");
		about.addChild(aboutNav);
		
		var regions = [ 
			{object:aboutTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:aboutContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:aboutNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layouts.add(new zim.Layout(about, regions, 0, null, true, null, stage));
		
		

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
		
		v.menuDeckSwipe = new zim.Swipe(menuDeck, 25, 50);	

		v.makeMenuDeck = function() {
			menuDeck.removeAllChildren();
			var card; var margin = 4; var size = 20;
			for (var i=0; i<6; i++) {
				m.currentCard = i;
				card = new Card(size, margin);
				card.x = i%3*(card.width-margin);
				card.y = Math.floor(i/3)*(card.height-margin);	
				menuDeck.addChild(card);
			}
			menuDeck.setBounds(0,0,card.width*3,card.height*2);
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
		menuDeck.cursor = "pointer";	
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
			{object:menuTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:menuContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:menuNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layouts.add(new zim.Layout(menu, regions, 0, null, true, null, stage));

		//stage.addChild(new zim.Grid(menu));
		
		
	
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
		
		// coded this before zim.Tabs were created
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
				
		var editCard = v.editCard = new Card();
		editContent.addChild(editCard);
		editCard.cursor = "pointer";

		var editNav = v.editNav = makeNav("CLEAR", "DONE");
		edit.addChild(editNav);
		
		var regions = [ 
			{object:editTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:editBar, marginTop:2, maxWidth:100, height:7, align:"right", valign:"middle", backgroundColor:"#000"},
			{object:editContent, marginTop:2, maxWidth:90, align:"center", valign:"top"},
			{object:editNav, marginTop:2, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layouts.add(new zim.Layout(edit, regions, 0, null, true, null, stage));

		// edit.addChild(new zim.Guide(edit));



////////////////////////////////////
		// play page
		
		var play = v.play = new createjs.Container();
		
		var playTop = v.playTop = makeTop();
		play.addChild(playTop);	

		var playContent = v.playContent = new createjs.Container();

		var playCard = v.playCard = new Card();
		playContent.addChild(playCard);	
		
		// container, width, height, label, color, drag, resets, modal, corner, etc.
		var playPopLab = new zim.Label("PREDICT HIDDEN SHAPE",80 , null, "white");
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
			{object:playTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:playContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:playNav, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		var shape = null; // new createjs.Shape();
		layouts.add(new zim.Layout(play, regions, 0, null, null, shape, stage));
		
			
		
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
			{object:resultTop, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:resultContent, marginTop:4, maxWidth:90, align:"center", valign:"center"},
			{object:resultNav, marginTop:6, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		var shape = null; // new createjs.Shape();
		layouts.add(new zim.Layout(result, regions, 0, null, null, shape, stage));


////////////////////////////////////
		// general functions
		
		function makeTop(backButton) {
			if (zot(backButton)) backButton = true;
			var top = new createjs.Container();
			top.setBounds(0,0,350,50);
			if (backButton) {
				top.button = new zim.Triangle(30,30,30,"rgba(0,0,0,.4)");
				top.button.rotation = -90;
				top.button.x = 19;
				top.button.y = 25;
				top.addChild(top.button);
				zim.expand(top.button);
			}
			var lab = zim.Label("PSYCHIC·PIXELS",40,"homespun","#222");
			// this font was messing up on mobile - registering as too wide
			// so hard coded appropriate bounds
			// unfortunately, needed to do that for the copies too
			lab.setBounds(0,0,258,38);
			top.addChild(lab);
			zim.centerReg(lab, top);
			multiplyText(lab, top, 3, 258, 38);
			return top;
		}
		
		function multiplyText(label, holder, num, bW, bH) {
			if (zot(num)) num = 3;
			var lab;
			var pAlpha = new zim.Proportion(1,num,.2,.05); // need at least 2
			for (var i=1; i<=num; i++) {
				lab = label.clone();
				if (!zot(bW)) lab.setBounds(0,0,bW,bH);
				holder.addChild(lab);
				zim.centerReg(lab);
				lab.x = label.x; lab.y = label.y;
				lab.scaleY = .7+.9*i;
				lab.alpha = pAlpha.convert(i);
			}			
		}
		
		function makeNav(left, right) {
			var nav = new createjs.Container();
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