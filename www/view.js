
var app = function(app) {
	
	app.makeView = function(model, layout) {
		
		var p = {}; // this object will hold all the pages and we return it
		var d = model; // the data object from model.js


////////////////////////////////////
		// first page
	
				
		var first = p.first = new createjs.Container();
		
		var firstTop = p.firstTop = makeTop(false); // no back arrow
		first.addChild(firstTop);	
		
		
		var firstContent = p.firstContent = new createjs.Container();
		first.addChild(firstContent);
		firstContent.cursor = "pointer";
		var size = 50;
		var cols = d.cols;
		var width = size*d.cols;
		var tile; var margin=6;
		for (var i=0; i<6; i++) {
			tile = new zim.Rectangle(width+margin*2,width+margin*2,"#333");
			firstContent.addChild(tile);
			tile.x = i%2*width;
			tile.y = Math.floor(i/2)*width;		
			makeTile(tile, 0, i, d.colors[i]);
 		}
		function makeTile(holder, set, card, color) {
			var square; 
			var data = d.data[set][card];
			for (var i=0; i<data.length; i++) {
				square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
				square.data = data[i];
				holder.addChild(square);
				square.x = i%cols*size+margin;
				square.y = Math.floor(i/cols)*size+margin;
			}
		}
		

		var firstNav = p.firstNav = makeNav("START", "HELP");
		first.addChild(firstNav);
		
		var regions = [ 
			{object:firstTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:firstContent, marginTop:5, maxWidth:90, align:"center", valign:"center"},
			{object:firstNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(first, regions, 0, null, true, null, stage));

		
		
////////////////////////////////////
		// edit page
		
		var color = d.colors[0];
		
		// move to controller
		// stage.canvas.style.backgroundColor = color;
				
		var edit = p.edit = new createjs.Container();
		
		var editTop = p.editTop = makeTop();
		edit.addChild(editTop);
		
		var editBar = new createjs.Container();
		editBar.setBounds(0,0,400,51);
		edit.addChild(editBar);
		
		var editSub = new zim.Label("CARDS", 20, null, "white");
		editSub.x = 14;
		editSub.y = 18;
		editBar.addChild(editSub);
		
		var editButs = p.editButs = new createjs.Container();
		var butColor; var but; var lab;
		for (var i=0; i<6; i++) {
			lab = new zim.Label(String(i+1), null, null, "#444", "white");
			but = new zim.Button(49, 49, lab, d.colors[i], "#333", null, 0, 0, -1);
			but.num = i;
			editButs.addChildAt(but, i);
			but.x = i*50;
		}
		editButs.x = 100;
		editButs.y = 1;
		editBar.addChild(editButs);
				 
		var cols = d.cols; 		
		var size = 100; // square size
		var margin = 1;
		
		var editContent = new createjs.Container();
		edit.addChild(editContent);
		
		var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
		editContent.addChild(backing);
		
		var squares = p.squares = new createjs.Container();
		squares.cursor="pointer";
		squares.color = color;
		editContent.addChild(squares);
		squares.x=squares.y=margin;
		
		p.makeSquares = function(set, card, color) {
			squares.removeAllChildren();
			var square; 
			var data = d.data[set][card];
			for (var i=0; i<data.length; i++) {
				square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
				square.data = data[i];
				squares.addChild(square);
				square.changed = false;
				square.x = i%cols*size;
				square.y = Math.floor(i/cols)*size;
			}
		}
		
		p.makeSquares(0, 0, color); // controller also makes squares so store on p
		
		var editNav = p.editNav = makeNav("CLEAR", "DONE");
		edit.addChild(editNav);
		
		var regions = [ 
			{object:editTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:editBar, marginTop:2, maxWidth:100, height:7, align:"right", valign:"middle", backgroundColor:"#000"},
			{object:editContent, marginTop:2, maxWidth:90, align:"center", valign:"top"},
			{object:editNav, marginTop:2, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(edit, regions, 0, null, true, null, stage));

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
				top.button.cursor = "pointer";
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
		
		return p;
	}
	return app;
}(app || {});