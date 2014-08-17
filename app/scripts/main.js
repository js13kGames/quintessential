
var Quintessential = function() {
	this.init();
}

Quintessential.prototype = {

	width: 400,
	height: 400,
	gameStates: [
		'start',
		'levelSelect',
		'game',
		'lose',
		'win'
	],
	currentState: '',
	levels: [
		'fire',
		'water',
		'air',
		'earth'
	],
	levelsCompleted: [],

/*
 * setup canvas,
 * start actual game
 */
	init: function() {
		console.log('play');
		// set up canvas 
		this.startGame();
	},

/*
 * assign first game state
 * call draw and update functions
 * -> request animation frame
 */
	startGame: function() {
		if (this.currentState === '') {
			this.currentState = 'start';
		}
		// start gameloop
		// call draw and update functions
	},

/*
 * DRAW
 */
	draw: function() {
		// check game state
		// call according draw function
	},

/*
 * UPDATE
 */
	update: function() {
		// check game state
		// call according update function(s)
	},

/*
 * GET STATE helper function
 */
	getState: function() {
		return this.currentState;
	},

/*
 * SET STATE helper function
 */
	setState: function(state) {
		this.currentState = state;
	},

/*
 * SET STATE helper function
 */
	isState: function(state) {
		return this.currentState === state;
	},

/*
 * CONTROLS
 */
	actions: function() {
		// check for game state
		// add listeners accordingly
		// remove listenders accordingly
		// fire left - right
		// water up - down
		// air press
		// earth release
		// mouseclicks for menu navigation
	}

}
