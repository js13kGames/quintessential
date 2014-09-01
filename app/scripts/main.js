'use strict';

var Quintessential = function() {
	this.init();
};

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
	currentLevel: '',
	levelsCompleted: [],
	canvas: '',
	canvasElement: document.querySelector('#maingame'),
	canvasWidth: 320,
	canvasHeight: 320,
	rAFid: 0, // requestAnimationFrame id
	player: {
		x: 0,
		y: 0,
		width: 32,
		height: 64,
		speed: 32,
		spacePressed: false,
	},
	enemyNumber: 7,
	enemies: {},

/*
 * setup canvas,
 * start actual game
 */
	init: function() {
		console.log('play');
		this.actions();
		// set up canvas 
		this.canvasElement.width = this.canvasWidth;
		this.canvasElement.height = this.canvasHeight;
		this.canvas = this.canvasElement.getContext('2d');
		// start actual game
		this.startGame();
	},

/*
 * assign first game state
 */
	startGame: function() {
		var self = this;
		// if no state is chosen
		if (this.currentState === '') {
			this.currentState = 'game';
			window.location.hash = 'game';
		}
		this.currentLevel = 'fire';
		this.player.x = this.canvasWidth / 2 - this.player.width / 2;
		this.player.y = this.canvasHeight / 2 - this.player.height / 2;
		this.gameLoop();
	},
	gameLoop: function() {
		var self = this;
		// for some reason this needs to wrapped to function...
		this.rAFid = window.requestAnimationFrame(function() {
			self.gameLoop();
		});
		this.gameLogic(); // check parameters for events and call other functions
		//this.updatePanel(); // update HUB
		this.draw(); // drawing
		console.log(new Date());
	},

/*
 * THiNK
 */
	gameLogic: function() {

	},

/*
 * DRAW
 */
	draw: function() {
		this.clear();
		// check game state
		// call according draw function
		if (this.currentState === 'game') {
			switch(this.currentLevel) {
				case 'fire':
					this.drawFire();
					break;
				case 'water':
					this.drawWater();
					break;
				case 'air':
					this.drawAir();
					break;
				case 'earth':
					this.drawEarth();
					break;
			}
		}
		this.drawPlayer();
	},
	drawFire: function() {
		console.log('drawing fire stage');
		this.drawElement();
	},
	drawWater: function() {
		console.log('drawing water stage');
	},
	drawAir: function() {
		console.log('drawing air stage');
	},
	drawEarth: function() {
		console.log('drawing earth stage');
	},
	drawPlayer: function() {
		this.canvas.strokeStyle = '#000000';
		this.canvas.fillStyle = '#000000';
		// draw outline
		this.canvas.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
	},
	drawElement: function() {
		this.canvas.strokeStyle = '#ff0000';
		this.canvas.fillStyle = '#ff0000';
		// draw outline
		this.canvas.fillRect(40, 40, 32, 32);
	},
	clear: function() {
		this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
 * Change STATE helper function
 */
	changeState: function() {
		var self = this;
		var fragment = window.location.hash;
		console.log('hello');

		// assign new state
		if (fragment !== this.currentState) {
			this.currentState = fragment;
		}
		if (this.currentState === 'game') {
			
			// this.rAFid = window.requestAnimationFrame(function() {
			// 	self.gameLoop();
			// });
		} else {
			console.log('Do something about '+ this.currentState);
		}
	},
/*
 * Choose Level
 */
	chooseLevel: function(event) {
		var levelAttr = event.target.attributes['data-level'];
		// @todo get level dynamic from link
		this.currentLevel = 'fire';
	},

/*
 * CONTROLS
 */
	actions: function() {
		var self = this;
		// @todo add eventlistener to all elements
		//var levelLinks = document.querySelectorAll('.level');
		window.addEventListener('hashChange', this.changeState);

		window.addEventListener('keydown', function(ev) {
			var key = ev.keyCode;
			// player controls
			if (self.currentLevel === 'fire' || self.currentLevel === 'air') {
				if (key === 38) { // up
					self.player.y = self.player.y - (1 * self.player.speed);
				} else if (key === 40) { // down
					self.player.y = self.player.y + (1 * self.player.speed);
				}
			} else if (self.currentLevel === 'water' || 	self.currentLevel === 'earth') {
				if (key === 39) { // right
					self.player.x = self.player.x + (1 * self.player.speed);
				} else if (key === 37) { // left
					self.player.x = self.player.x - (1 * self.player.speed);
				}
			}
			// collect element switch pt1
			if (key === 32) { // space
				this.player.spacePressed = true;
			}
		});
		window.addEventListener('keyup', function(ev) {
			var key = ev.keyCode;
			// collect element switch pt2
			if (key === 32) { // space
				this.player.spacePressed = false;
			}
		});
		document.querySelector('.level').addEventListener('click', this.chooseLevel);
	}

};
