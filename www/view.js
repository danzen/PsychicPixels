
var app = function(app) {
	
	app.makeView = function(model, layout) {
		
		var p = {}; // this object will hold all the pages and we return it
		var d = model; // the data object from model.js

		// make edit page
		
		var color = d.colors[0];
		stage.canvas.style.backgroundColor = color;
				
		var edit = p.edit = new createjs.Container();
		
		var editTop = p.editTop = makeTop();
		edit.addChild(editTop);
		
		var editBar = p.editNav = new createjs.Container();
		editBar.setBounds(0,0,400,51);
		edit.addChild(editBar);
		var editSub = new zim.Label("CARDS", 20, null, "white");
		editSub.x = 14;
		editSub.y = 18;
		editBar.addChild(editSub);
		var editButs = p.editButs = new createjs.Container();
		editButs.selected = 0;
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
				
		var data = d.data;		 
		var cols = d.cols; 
		
		var size = 100; // square size
		var margin = 1;
		
		var editContent = new createjs.Container();
		edit.addChild(editContent);
		
		var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
		editContent.addChild(backing);
		
		var squares = p.squares = new createjs.Container();
		p.squares.color = color;
		editContent.addChild(squares);
		squares.x=squares.y=margin;
		
		p.makeSquares = function(set, index, color) {
			squares.removeAllChildren();
			var square; 
			for (var i=0; i<data.length; i++) {
				square = new zim.Rectangle(size-1,size-1,(data[i])?"black":color);
				square.data = data[i];
				squares.addChild(square);
				square.changed = false;
				square.x = i%cols*size;
				square.y = Math.floor(i/cols)*size;
			}
		}
		
		p.makeSquares(0, 0, color);
		
		var editNav = new createjs.Container();
		edit.addChild(editNav);
		
		// width, height, label, color, rollColor, borderColor, borderThickness, corner, shadowColor
		var editClear = p.editClear = new zim.Button(200, 70, "CLEAR", "#222", "#444", null, 0, 0, -1);
		editNav.addChild(editClear);
		
		var editDone = p.editDone = new zim.Button(200, 70, "DONE", "#222", "#444", null, 0, 0, -1);
		editNav.addChild(editDone);
		editDone.x = editClear.width+2;
		
		var regions = [ 
			{object:editTop, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"top"},
			{object:editBar, marginTop:2, maxWidth:100, height:7, align:"right", valign:"middle", backgroundColor:"#000"},
			{object:editContent, marginTop:2, maxWidth:90, align:"center", valign:"top"},
			{object:editNav, marginTop:2, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(p.edit, regions, 0, null, true, null, stage));


		// general functions
		
		function makeTop(backButton) {
			if (zot(backButton)) backButton = true;
			var top = new createjs.Container();
			top.setBounds(0,0,350,50);
			if (backButton) {
				top.button = new zim.Triangle(30,30,30,"#333");
				top.button.rotation = -90;
				top.button.x = 19;
				top.button.y = 25;
				top.button.cursor = "pointer";
				top.addChild(top.button);
				zim.expand(top.button);
			}
			var label = zim.Label("Psychic Pixels");
			top.addChild(label);
			label.x = 60;
			label.y = 9;
			return top;
		}
		
		return p;
	}
	return app;
}(app || {});