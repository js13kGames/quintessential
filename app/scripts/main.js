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
	currentLevel: '',
	level: {
		fire: {
			axis: 'x',
			color: '#ff0000',
			action: 'pressed',
			completed: false
		},
		water: {
			axis: 'y',
			color: '#0000ff',
			action: 'pressed',
			completed: false
		},
		air: {
			axis: 'x',
			color: '#ffaa00',
			action: 'release',
			completed: false
		},
		earth: {
			axis: 'x',
			color: '#339911',
			action: 'release',
			completed: false
		}
	},
	canvas: '',
	canvasElement: document.querySelector('#maingame'),
	canvasWidth: 320,
	canvasHeight: 320,
	rAFid: 0, // requestAnimationFrame id
	player: {
		x: 0,
		y: 0,
		width: 32,
		height: 32,
		speed: 16,
		spacePressed: false,
	},
	enemyStats: {
		width: 32,
		height: 32,
		possiblePos: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	},
	enemies: [],

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
			this.currentState = 'start';
			window.location.hash = 'start';
			//this.currentLevel = 'fire';
		}
		//this.currentLevel = 'fire';
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

		this.drawElement();
		this.drawPlayer();
	},

	drawPlayer: function() {
		this.canvas.strokeStyle = '#000000';
		this.canvas.fillStyle = '#000000';
		this.canvas.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
	},
	drawElement: function() {
		var self = this;
		var level = self.currentLevel;
		// this.canvas.strokeStyle = this.level[level]['color'];
		// this.canvas.fillStyle = this.level[level]['color'];
		this.canvas.strokeStyle = '#ff0000';
		this.canvas.fillStyle = '#ff0000';
		// this.canvas.fillRect(40, 40, this.enemyStats.width, this.enemyStats.height);
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i][0] === false) {

				// say where elements start
				this.enemies[i].push(this.pickRandom([10, 310]));
				// and save it for laters
				if (this.enemies[i][2] === 10) {
					this.enemies[i].push('pos');
				} else {
					this.enemies[i].push('neg');
				}

				if (this.level[level]['axis'] === 'x') {
					this.canvas.fillRect(this.enemies[i][2], this.enemies[i][1] * 32, this.enemyStats.width, this.enemyStats.height);
				} else if (this.level[level]['axis'] === 'y') {
					this.canvas.fillRect(this.enemies[i][1] * 32, this.enemies[i][2], this.enemyStats.width, this.enemyStats.height);
				}
				this.enemies[i][0] = true;
			} else {

				// check with direction to go
				if (this.enemies[i][3] === 'pos' ) {
					this.enemies[i][2] = this.enemies[i][2] + 1;
				} else {
					this.enemies[i][2] = this.enemies[i][2] - 1;
				}
				

				if (this.level[level]['axis'] === 'x') {
					this.canvas.fillRect(this.enemies[i][2], this.enemies[i][1] * 32, this.enemyStats.width, this.enemyStats.height);
					
					// almost! need to consider the ones that go the other way! smaller then 0
					if (this.enemies[i][2] > this.canvasHeight + this.enemyStats.height) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
						console.log(this.enemies[i]);
					}
				} else if (this.level[level]['axis'] === 'y') {
					this.canvas.fillRect(this.enemies[i][1] * 32, this.enemies[i][2], this.enemyStats.width, this.enemyStats.height);
					if (this.enemies[i][2] > this.canvasWidth + this.enemyStats.width) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
						console.log(this.enemies[i]);
					}
				}
			}
		}
	},
	clear: function() {
		this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	},
	populateEnemies: function() {

		for (var i = 0; i < this.enemyStats.possiblePos.length; i++) {
			this.enemies[i] = [];
			this.enemies[i].push(false);
			this.enemies[i].push(this.enemyStats.possiblePos[i]);
		};
		console.log(this.enemies);
	},
	pickRandom: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},

/*
 * UPDATE
 */
	update: function() {
		// check game state
		// call according update function(s)
	},

/*
 * Change STATE helper function
 */
	changeState: function() {
		var fragment = window.location.hash;
		// assign new state
		if (fragment !== this.currentState) {
			this.currentState = fragment.substr(1);
		}
	},
/*
 * Choose Level
 */
	chooseLevel: function(event) {
		this.currentLevel = event.originalTarget.dataset.level;
		this.populateEnemies();
		console.log(this.currentLevel);
	},

/*
 * CONTROLS
 */
	actions: function() {
		var self = this;

		var levelLinks = document.querySelectorAll('.level');
		for (var i = 0; i < levelLinks.length; i++) {
			levelLinks[i].addEventListener('click', function(event) {
				self.chooseLevel(event);
			});
		};

		window.addEventListener('hashchange', this.changeState);

		window.addEventListener('keydown', function(ev) {
			var key = ev.keyCode;
			// player controls
			if (self.currentLevel === 'fire' || self.currentLevel === 'air') {
				if (key === 38) { // up
					if(self.player.y > 0) {
						self.player.y = self.player.y - (1 * self.player.speed);
					}
				} else if (key === 40) { // down
					if(self.player.y + self.player.height < self.canvasHeight) {
						self.player.y = self.player.y + (1 * self.player.speed);
					}
				}
			} else if (self.currentLevel === 'water' || self.currentLevel === 'earth') {
				if (key === 39) { // right
					if(self.player.x + self.player.width < self.canvasWidth) {
						self.player.x = self.player.x + (1 * self.player.speed);
					}
				} else if (key === 37) { // left
					if(self.player.x > 0) {
						self.player.x = self.player.x - (1 * self.player.speed);
					}
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
	}

};
