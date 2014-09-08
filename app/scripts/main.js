'use strict';

var Quintessential = function() {
	this.init();
};

Quintessential.prototype = {

	width: 400,
	height: 400,
	gameStates: [
		'start',
		'levelselect',
		'game',
		'win',
		'winwin'
	],
	currentState: '',
	currentLevel: '',
	level: {
		fire: {
			axis: 'x',
			color: '#ff0000',
			action: true,
			completed: false
		},
		water: {
			axis: 'y',
			color: '#0000ff',
			action: true,
			completed: false
		},
		air: {
			axis: 'x',
			color: '#ffaa00',
			action: false,
			completed: false
		},
		earth: {
			axis: 'y',
			color: '#339911',
			action: false,
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
		image: {},
		radius: 0
	},
	enemyStats: {
		width: 32,
		height: 32,
		possiblePos: [1, 3, 5, 7, 9],
	},
	enemies: [],
	radius: 0,
	score: {
		element: document.querySelector('#score'),
		current: 0,
		max: 5
	},

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
		this.radius = this.getBoundingCircleRadius();
		this.player.radius = this.getBoundingCircleRadiusPlayer();
		this.player.image = new Image();
		this.player.image.src = '/images/alchemist.png';
	},

/*
 * assign first game state
 */
	startGame: function() {
		// if no state is chosen
		if (this.currentState === '') {
			this.currentState = 'start';
			window.location.hash = 'start';
		}
		this.gameLoop();
	},
	gameLoop: function() {
		var self = this;
		// for some reason this needs to wrapped to function...
		this.rAFid = window.requestAnimationFrame(function() {
			self.gameLoop();
		});
		this.updatePanel(); // update HUB
		this.draw(); // drawing
		this.winLevel();
	},
	winLevel: function() {
		var self = this;
		var level = self.currentLevel;
		var winwin = true;

		if (this.score.current === this.score.max) {
			this.level[level].completed = true;
			this.score.current = 0;
			document.querySelector('#what-you-won').innerHTML = this.currentLevel;
			window.location.hash = 'win';
		}

		for (var prob in this.level) {
			if (this.level[prob].completed === false) {
				winwin = false;
			} else {
				document.querySelector('.level--'+ this.currentLevel).classList.add('is-done');
			}
		}
		if (winwin === true) {
			window.location.hash = 'winwin';
		}
	},
	getBoundingCircleRadius: function() {
		// actually very bad
		// only works because player and elements have same width and height
		return Math.sqrt(((this.enemyStats.width/2 * this.enemyStats.width/2) + (this.enemyStats.height/2 * this.enemyStats.height/2)));
	},
	getBoundingCircleRadiusPlayer: function() {
		return Math.sqrt(((this.player.width/3 * this.player.width/3) + (this.player.height/2 * this.player.height/2)));
	},
	circlesIntersect: function(c1X,c1Y,c1Radius, c2X, c2Y, c2Radius) {
		var distanceX = c2X - c1X + 13;
		var distanceY = c2Y - c1Y + 13;
		var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

		return magnitude < c1Radius + c2Radius;
	},

	updatePanel: function() {
		// var elem;
		var count = 0;
		for (var i = 0; i < this.score.current; i++) {
			// elem = document.createElement('i');
			// this.score.element.appendHtml(elem);
			count = count +1;
		}
		this.score.element.innerHTML = count;
	},

	draw: function() {
		this.clear();

		this.drawElement();
		this.drawPlayer();
	},

	drawPlayer: function() {
		if(!this.player.image.complete) {
			this.canvas.strokeStyle = '#000000';
			this.canvas.fillStyle = '#000000';
			this.canvas.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
		} else {
			this.canvas.drawImage(this.player.image, this.player.x, this.player.y);
		}
	},
	drawElement: function() {
		var self = this;
		var level = this.currentLevel;
		var randomFactor;
		var intersect;
		if (level !== '') {
			this.canvas.strokeStyle = this.level[level].color;
			this.canvas.fillStyle = this.level[level].color;
		}
		for (var i = 0; i < this.enemies.length; i++) {
			/*
			 * element spawning
			 */
			randomFactor = this.pickRandom(this.enemyStats.possiblePos) * 10;
			if (this.enemies[i][0] === false) {
				// say where elements start
				this.enemies[i].push(this.pickRandom([ randomFactor - 100, randomFactor + this.canvasWidth]));
				// and save it for laters
				if (this.enemies[i][2] <= 100) {
					this.enemies[i].push('pos');
				} else {
					this.enemies[i].push('neg');
				}

				if (this.level[level].axis === 'x') {
					this.canvas.fillRect(this.enemies[i][2], this.enemies[i][1] * 32, this.enemyStats.width, this.enemyStats.height);
				} else if (this.level[level].axis === 'y') {
					this.canvas.fillRect(this.enemies[i][1] * 32, this.enemies[i][2], this.enemyStats.width, this.enemyStats.height);
				}
				this.enemies[i][0] = true;
			/*
			 * element moving
			 */
			} else {

				// check with direction to go
				if (this.enemies[i][3] === 'pos' ) {
					this.enemies[i][2] = this.enemies[i][2] + 1;
				} else {
					this.enemies[i][2] = this.enemies[i][2] - 1;
				}
				

				if (this.level[level].axis === 'x') {
					this.canvas.fillRect(this.enemies[i][2], this.enemies[i][1] * 32, this.enemyStats.width, this.enemyStats.height);
					// check when elements leave canvas an respawn
					if (this.enemies[i][2] > this.canvasHeight + this.enemyStats.height) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
					} else if (this.enemies[i][2] < -64) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
					}
					/*
					 * element collision
					 */
					intersect = this.circlesIntersect(this.enemies[i][2], this.enemies[i][1] * 32, this.radius, this.player.x, this.player.y, this.radius);
					if (this.player.spacePressed === this.level[level].action && intersect === true ) {
						this.score.current = this.score.current + 1;
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
					}


				} else if (this.level[level].axis === 'y') {
					this.canvas.fillRect(this.enemies[i][1] * 32, this.enemies[i][2], this.enemyStats.width, this.enemyStats.height);
					// check when elements leave canvas an respawn
					if (this.enemies[i][2] > this.canvasWidth + this.enemyStats.width) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
					} else if (this.enemies[i][2] < -64) {
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
					}
					/*
					 * element collision
					 */
					intersect = this.circlesIntersect(this.enemies[i][1] * 32, this.enemies[i][2], this.radius, this.player.x, this.player.y, this.radius);
					if (this.player.spacePressed === this.level[level].action && intersect === true ) {
						this.score.current = this.score.current + 1;
						this.enemies[i][0] = false;
						this.enemies[i].length = 2;
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
		}
	},
	pickRandom: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},

	changeState: function() {
		var fragment = window.location.hash;
		// assign new state
		if (fragment !== this.currentState) {
			this.currentState = fragment.substr(1);
		}
	},

	chooseLevel: function(event) {
		this.currentLevel = event.originalTarget.dataset.level;
		var level = this.currentLevel;
		this.populateEnemies();
		this.player.spacePressed = !this.level[level].action;
		this.player.x = this.canvasWidth / 2 - this.player.width / 2;
		this.player.y = this.canvasHeight / 2 - this.player.height / 2;
	},

	actions: function() {
		var self = this;

		var levelLinks = document.querySelectorAll('.level');
		for (var i = 0; i < levelLinks.length; i++) {
			levelLinks[i].addEventListener('click', function(event) {
				self.chooseLevel(event);
			});
		}

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
				self.player.spacePressed = true;
			}
		});
		window.addEventListener('keyup', function(ev) {
			var key = ev.keyCode;
			// collect element switch pt2
			if (key === 32) { // space
				self.player.spacePressed = false;
			}
		});
	}

};
