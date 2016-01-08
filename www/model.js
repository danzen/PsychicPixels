
var app = function(app) {
	
	app.makeModel = function() {
		
		var m = {}; // model object to hold all our data properties and we return it
		
		// the technique used here and below is to keep a local variable for legibility
		// but also, for any object needed outside this function, we store it on the model object (m)
		// m then gets returned to the main script and passed into the view and the controller
		// that way, the view and controller can access and update data from the model
			
		var cols = m.cols = 13; // pixels in cards 
		
		m.colors = ["#98dcd5","#f9bd7f","#e4c8ab","#efaddd","#fdf377","#cee58f"];
		m.helpColors = ["#efaddd","#98dcd5","#f9bd7f"];
		zim.shuffle(m.colors);
		
		m.newSet = function() { // function to add a new set of cards to the data
			data.push([]); // new set array that will hold six cards
			m.currentSet = data.length-1;
			m.currentCard = 0;
			var set = data[m.currentSet];
						
			var i; var j;
			for (i=0; i<6; i++) {
				set.push([]); // new card that holds the pixels
				for (j=0; j<cols*cols; j++) {
					set[i].push(0); // 0 represents empty
				} 
			}	
			localStorage.data = JSON.stringify(data);
		}
		
		// localStorage.clear(); // uncomment this to clear all saved data
		
		// data for initial set - that cannot be edited or deleted  - note, this is JSON
		var start = "[[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,0,0,1,1,0,0,0,1,1,0,0,1,0,1,0,0,1,1,0,0,0,1,1,0,0,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]]";
		
		// used for help and about pages
		m.single = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		m.double = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,1,0,1,1,0,0,1,1,1,0,0,0,0,1,0,1,1,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		m.danzen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1,1,1,0,1,0,0,1,1,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,1,0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,1,1,1,0,0,1,0,1,0,0,0,0,1,0,0,1,0,1,1,0,1,1,0,0,0,1,0,0,1,0];
		
		// localStorage does not work locally on IE/Edge but fine in browser
		var data; 	
		if (!localStorage || !localStorage.data) {			
			if (localStorage) localStorage.data = start; // first time in
			data = m.data = JSON.parse(start);
			// m.newSet(); // only needed during development to make the first set
		} else {
			data = m.data = JSON.parse(localStorage.data); // already used app
		}
		zim.shuffle(data[0]); // randomize the order of the shapes
		
		m.currentSet = 0; // these are used to keep track of set and card everywhere in app
		m.currentCard = 0;
		
		m.save = function() {
			localStorage.data = JSON.stringify(data);
		}
		
		m.removeSet = function(index) {
			data.splice(index, 1);
			if (m.currentSet > data.length-1) {
				m.currentSet--;
			}		
			localStorage.data = JSON.stringify(data);
		}
		
		// for play and results section
		m.score = 0;
		m.tries = 0;		
		m.resultPhrases = [
			"UNLUCKY 0/6",
			"AVERAGE 1/6",
			"NOVICE 2/6",
			"LUCKY 3/6",
			"GIFTED 4/6",
			"SPOOKY 5/6",
			"PSYCHIC 6/6",	
		];

		return m;
	}
	return app;
}(app || {});