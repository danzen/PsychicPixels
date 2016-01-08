
var app = function(app) {
	
	app.makeView = function(model, layout) {
		
		var p = {}; // this object will hold all the pages and we return it
		var d = model; // the data object from model.js

		// make edit page
		
		var edit = p.edit = new createjs.Container();
		
		var editTop = p.editTop = makeTop();
		edit.addChild(editTop);
				
		var data = d.data;		 
		var cols = d.cols; 
		
		var size = 100; // square size
		var margin = 1;
		
		var editContent = new createjs.Container();
		edit.addChild(editContent);
		
		var backing = new zim.Rectangle(cols*size+margin*2-1, cols*size+margin*2-1, "#666");
		editContent.addChild(backing);
		
		var squares = p.squares = new createjs.Container();
		editContent.addChild(squares);
		squares.x=squares.y=margin;
		
		var square; var color;
		for (var i=0; i<data.length; i++) {
			square = new zim.Rectangle(size-1,size-1,(data[i])?"black":"yellow");
			square.data = data[i];
			squares.addChild(square);
			square.changed = false;
			square.x = i%cols*size;
			square.y = Math.floor(i/cols)*size;
		}
		
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
			{object:editContent, marginTop:5, maxWidth:90, align:"center", valign:"top"},
			{object:editNav, marginTop:5, maxWidth:100, minHeight:10, align:"center", valign:"bottom", backgroundColor:"#000"},
		];
		layout.add(new zim.Layout(p.edit, regions, 0, null, true, new createjs.Shape(), stage));


		// general functions
		
		function makeTop() {
			var top = new createjs.Container();
			top.setBounds(0,0,330,50);
			top.button = new zim.Button(45,50,"","#222", "#444", null, 0, 0, -1);
			top.addChild(top.button);
			var triangle = new zim.Triangle(30,30,30,"white");
			triangle.rotation = -90;
			triangle.x = 18;
			triangle.y = 25;
			triangle.mouseEnabled = false;
			top.addChild(triangle);
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