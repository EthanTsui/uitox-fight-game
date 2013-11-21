/* 
 * Game name: Uitox fight! Beta
 * Version: 0.1.0
 * Created date: 2013-11-9
 * Architect and developer: Ethan Yin-Hao Tsui
 * Designed and developed in Object-Oriented Javascript
 */

/**
 * Unit is a superclass for each unit;
 */
function Unit() {
	this.x = 0;
	this.y = 0;
	this.img = null;
	this.width = 0;
	this.height = 0;
	this.destroyed = false;
	this.lastUpdate = new Date();

};

Unit.prototype.draw = function(context) {
	context.drawImage(this.img, this.x, this.y);

};

Unit.prototype.readyForNext = function(ms) {
	var now = new Date();
	if (now.getTime() - this.lastUpdate.getTime() >= ms) {
		this.lastUpdate = now;
		return true;
	}
	return false;

};

/**
 * return true if there any intersection in this object and unit.
 * 
 * @param unit
 * @returns {Boolean}
 */
Unit.prototype.collide = function(unit) {
	return ((this.x <= unit.x && (this.x + this.width) >= unit.x) || (unit.x <= this.x && (unit.x + unit.width) >= this.x))
			&& ((this.y <= unit.y && (this.y + this.width) >= unit.y) || (unit.y <= this.y && (unit.y + unit.width) >= this.y));

};

// Class Uitox
Uitox.prototype = new Unit();
Uitox.prototype.constructor = Uitox;
function Uitox() {
	this.x = 200;
	this.y = CANVAS_HEIGHT - 100;
	this.width = 122;
	this.height = 61;
	this.shift = 0;
	this.shiftLowerBound = 0;
	this.shiftUpperBound = 40;
};

Uitox.prototype.increaseSpeed = function() {
	if (this.shift < this.shiftUpperBound) {
		this.shift += 2;
	}
};

Uitox.prototype.decreaseSpeed = function() {
	if (this.shift > this.shiftLowerBound) {
		this.shift -= 2;
	}
};

Uitox.prototype.moveRight = function() {
	if ((this.x + this.shift + this.width) <= CANVAS_WIDTH - MARGIN) {
		this.x = this.x + this.shift;
	}
};

Uitox.prototype.moveLeft = function() {
	if ((this.x - this.shift) >= MARGIN) {
		this.x = this.x - this.shift;
	}
};

Uitox.prototype.draw = function(ctx) {
	// draw car shadow
	if (37 in keysDown) { // move to left
		var tmp = ctx.globalAlpha;
		ctx.globalAlpha = 0.1;
		ctx.drawImage(this.img, this.x + (this.shift / 2) * 2, this.y);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this.img, this.x + (this.shift / 2), this.y);
		ctx.globalAlpha = tmp;
	} else if (39 in keysDown) { // move to right
		var tmp = ctx.globalAlpha;
		ctx.globalAlpha = 0.1;
		ctx.drawImage(this.img, this.x - (this.shift / 2) * 2, this.y);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this.img, this.x - (this.shift / 2), this.y);
		ctx.globalAlpha = tmp;
	}
	ctx.drawImage(this.img, this.x, this.y);

};

// Class Enemy
Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;
function Enemy() {
	this.direction = 0;
	this.distance = 0;
	this.movement = null;
};

Enemy.prototype.setMovement = function(movement1) {
	this.movement = movement1;
	movement1.enemy = this;
};

Enemy.prototype.checkDirection = function() {
	if (this.distance <= 0) {
		if (Math.random() <= 0.5) {
			this.direction = 0;
		} else {
			this.direction = 1;
		}
		this.distance = randomIntNumber(15, CANVAS_WIDTH * 0.3);
	}
};

Enemy.prototype.move = function() {
	this.checkDirection();
	this.movement.move(this);
};

Enemy.prototype.draw = function(context) {
	this.movement.draw(context);
	context.drawImage(this.img, this.x, this.y);

};

// Class Bullet
Bullet.prototype = new Unit();
Bullet.prototype.constructor = Bullet;
function Bullet() {
	this.width = 13;
	this.height = 50;
	this.bulletSpeed = 1;
	this.bulletSpeedUpbound = 15;
};

Bullet.prototype.move = function() {
	if (this.y - this.bulletSpeed < -1) {
		this.destroyed = true;
	} else {
		this.y -= this.bulletSpeed;
	}
	if (this.bulletSpeed < this.bulletSpeedUpbound) {
		if (this.readyForNext(200)) {
			this.bulletSpeed += 3;
		}

	}
};

// Class Explosion
Explosion.prototype = new Unit();
Explosion.prototype.constructor = Explosion;
function Explosion() {
	this.index = 0;
};

Explosion.prototype.draw = function(ctx) {
	if (this.index <= 12) {
		ctx.drawImage(this.img, this.width * this.index, 0, this.width, this.height, this.x, this.y, this.width,
				this.height);
		var now = new Date();
		if (this.readyForNext(30)) {
			this.index++;
		}
	} else {
		this.destroyed = true;
	}

};

/**
 * class Resources
 */
function Resources() {
	this.res = {};
	this.images = new Array();
	this.readyCount = 0;
	this.numberToReady = 0;

	this.init = function() {
		this.res["background"] = "./images/bg.png";
		this.res["carleft"] = "./images/uitoxcarleft.png";
		this.res["carright"] = "./images/uitoxcarright.png";
		this.res["explosion"] = "./images/explosion.png";
		this.res["bullet"] = "./images/rocket.png";
		this.res["uitoxcar"] = "./images/uitoxcar.png";
		// this.res["uitoxcar"]="./images/bubble.png";

		// enemies
		// this.res["yahoo"]="./images/yahoo.png";
		// this.res["pchome"]="./images/pchome.png";
		// this.res["tao"]="./images/tao.png";
		// this.res["tmall"]="./images/tmall.png";
		// this.res["jd"] ="./images/jd.png";
		// this.res["momo"]="./images/momo.png";

		this.res["yahoo"] = "./images/boss1.png";
		this.res["pchome"] = "./images/boss2.png";
		this.res["tao"] = "./images/boss3.png";
		this.res["tmall"] = "./images/papa.png";
		this.res["jd"] = "./images/boss4.png";
		this.res["momo"] = "./images/momo.png";

		for ( var key in this.res) {
			this.initImage(key, this.res[key]);
		}

	};

	this.initImage = function(imageName, imagePath) {
		this.numberToReady++;
		var image = new Image();
		image.name = imageName;
		image.src = imagePath;
		image.onload = function() {
			mainController.resources.readyCount++;

		};
		this.images[this.images.length] = image;
	};

	this.loadImage = function(imageName, unit) {
		for (var i = 0; i < this.images.length; i++) {
			if (imageName == this.images[i].name) {
				unit.width = this.images[i].width;
				unit.height = this.images[i].height;
				unit.img = this.images[i];
				return;
			}
		}
	};

	this.getImage = function(imageName) {
		for (var i = 0; i < this.images.length; i++) {
			if (imageName == this.images[i].name) {
				return this.images[i];
			}
		}
	};

	this.isReady = function() {
		return this.readyCount == this.numberToReady;
	};
};

// Class MainController
function MainController() {
	this.stopFlag = false;
	this.ctx = null;
	this.uitox = new Uitox();
	this.enemies = null;
	this.enemyNumber = 3;
	this.bullets = null;
	this.gameStarted = true;
	this.strongFireNumber = 5;
	this.superFireNumber = 2;
	this.explosions = null;
	this.background = null;
	this.resources = new Resources();

	var that = this;
	// initial all objects
	this.init = function() {
		this.ctx = document.getElementById("canvas_fg").getContext("2d");
		this.strongFireNumber = 5;
		this.superFireNumber = 2;

		this.background = this.resources.getImage("background");

		this.drawBackground();

		// initial uitox
		this.resources.loadImage("carleft", this.uitox);

		// initial enemies
		this.enemies = new Array();
		for (var i = 0; i < this.enemyNumber; i++) {
			var enemy = new Enemy();
			var tmp = Math.random();
			enemy.r = randomIntNumber(1, 100);
			if (tmp <= 0.15) { // 15%
				this.resources.loadImage("yahoo", enemy);
				enemy.setMovement(new SpeedMovement(randomIntNumber(3, 6)));
			} else if (tmp <= 0.29) { // 14%
				this.resources.loadImage("pchome", enemy);
				enemy.setMovement(new SpeedMovement(randomIntNumber(2, 6)));
			} else if (tmp <= 0.49) { // 20%
				this.resources.loadImage("tao", enemy);
				if (Math.random()<0.05) {
					enemy.setMovement(new SpeedMovement(randomIntNumber(30, 80)));
				} else {
					enemy.setMovement(new SpeedMovement(randomIntNumber(2, 6)));
				}

			} else if (tmp <= 0.69) { // 20%
				this.resources.loadImage("tmall", enemy);
				if (Math.random()<0.1) {
					enemy.setMovement(new SpeedMovement(randomIntNumber(30, 80)));
				} else {
					enemy.setMovement(new SpeedMovement(randomIntNumber(2, 6)));
				}
			} else if (tmp <= 0.88) { // 19%
				this.resources.loadImage("jd", enemy);
				enemy.setMovement(new SpeedMovement(randomIntNumber(2, 6)));
			} else { // 12%
				this.resources.loadImage("momo", enemy);
				enemy.setMovement(new SpeedMovement(randomIntNumber(1, 5)));
			}
			enemy.x = randomIntNumber(100, CANVAS_WIDTH - 150);
			enemy.y = randomIntNumber(50, 100);
			this.enemies[this.enemies.length] = enemy;
		}

		// initial bullets and explosions
		this.bullets = new MyArray();
		this.explosions = new MyArray();

		this.gameStarted = true;
	};

	this.move = function() {
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].destroyed == false) {
				this.enemies[i].move();
			}
		}
		this.bullets.scanAll((function(bullet) {
			if (bullet.destroyed == false) {
				bullet.move();
			}
		}));

	};

	this.drawBackground = function() {
		var bgctx = document.getElementById("canvas_bg").getContext("2d");
		// draw background
		if (bgReady == true) {
			var sx = this.background.width - CANVAS_WIDTH;
			if (sx < 0) {
				sx = 0;
			}
			bgctx.drawImage(this.background, sx, 0, this.background.width - sx, 400, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		} else {
			bgctx.fillStyle = "#222222";
			bgctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
	};

	this.draw = function() {

		// this.drawBackground();

		this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// draw enemies
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].destroyed == false) {
				this.enemies[i].draw(this.ctx);
			}
		}

		// draw bullets
		this.bullets.scanAll((function(bullet) {
			if (bullet.destroyed == false) {
				bullet.draw(that.ctx);
			}
		}));

		// draw explosions
		this.explosions.scanAll((function(explosion) {
			if (explosion.destroyed == false) {
				explosion.draw(that.ctx);
			}
		}));

		// draw uitox
		this.uitox.draw(this.ctx);

		// draw text
		this.ctx.font = "16px Arial";

		drawShadowText(this.ctx, "#eeeeee", "中型武器(D鍵)：" + this.strongFireNumber, 10, 260);

		drawShadowText(this.ctx, "#eeeeee", "超級武器(S鍵)：" + this.superFireNumber, 10, 285);

		// count numbers of survived enemies
		var counter = 0;
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].destroyed == false) {
				counter++;
			}
		}

		drawShadowText(this.ctx, "#ffffff", "剩餘目標：" + counter, 10, 25);

	};

	this.fire = function() {
		var bullet = new Bullet();
		this.resources.loadImage("bullet", bullet);
		bullet.x = this.uitox.x + this.uitox.width / 2 - 5;
		bullet.y = this.uitox.y - 10;
		this.bullets.push(bullet);
	};

	this.strongFire = function() {
		if (this.strongFireNumber > 0) {
			var num = 5;
			for (var i = 0; i < num; i++) {
				var bullet = new Bullet();
				this.resources.loadImage("uitoxcar", bullet);
				bullet.x = this.uitox.x - ((num * bullet.width) / 2) + (i * bullet.width);
				bullet.y = this.uitox.y - 10;
				bullet.bulletSpeed = randomIntNumber(5, 12);
				bullet.bulletSpeedUpbound = randomIntNumber(30, 50);
				this.bullets.push(bullet);
			}
			this.strongFireNumber--;
		}
	};

	this.superFire = function() {
		if (this.superFireNumber > 0) {
			for (var i = 0; i < 10; i++) {
				for (var j = 0; j < CANVAS_WIDTH / 60; j++) {
					var bullet = new Bullet();
					this.resources.loadImage("uitoxcar", bullet);
					bullet.x = j * randomIntNumber(bullet.width - 5, bullet.width + 5);
					bullet.y = this.uitox.y - 10 + (i * 100);
					bullet.bulletSpeed = randomIntNumber(5, 12);
					bullet.bulletSpeedUpbound = randomIntNumber(30, 50);
					this.bullets.push(bullet);
				}
			}

			this.superFireNumber--;
		}
	};

	this.detectCollisions = function() {
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].destroyed == true) {
				continue;
			}
			for (var j = 0; j < this.bullets.arrays.length; j++) {
				if (this.bullets.arrays[j].destroyed == true) {
					continue;
				}
				if (this.enemies[i].collide(this.bullets.arrays[j])) {
					// hit!
					this.enemies[i].destroyed = true;
					this.bullets.arrays[j].destroyed = true;

					var explosion = new Explosion();
					this.resources.loadImage("explosion", explosion);
					explosion.width = 39;
					explosion.x = this.enemies[i].x + this.enemies[i].width / 2;
					explosion.y = this.enemies[i].y - this.enemies[i].height / 2;
					this.explosions.push(explosion);
					break;
				}

			}
		}
	};

	this.checkVictory = function() {
		var end = true;
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].destroyed == false) {
				end = false;
				break;
			}
		}

		if (this.gameStarted == true && end == true) {
			// victory!!!

			stopInterval();
			var tmp = this.ctx.globalAlpha;
			this.ctx.fillStyle = "#eeeeee";
			this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			this.ctx.globalAlpha = 0.7;
			this.draw();
			this.ctx.globalAlpha = tmp;
			this.ctx.font = "bold 64px Arial";
			drawShadowText(this.ctx, "#0068b7", "Uitox 勝利！！！", 50, CANVAS_HEIGHT / 2 - 32);
			drawShadowText(this.ctx, "#ff6443", "Uitox 勝利！！！", 80, CANVAS_HEIGHT / 2 - 32 + 80);
		}
		;

	};
};

// util function: draw shadow
function drawShadowText(ctx, style, text, x, y) {
	ctx.fillStyle = "#000000";
	ctx.fillText(text, x + 3, y + 3);
	ctx.fillStyle = style;
	ctx.fillText(text, x, y);

}

// class Movement
function Movement() {
	this.enemy = null;
	this.r = 50;
}

Movement.prototype.move = function(enemy) {

};
Movement.prototype.draw = function(enemy) {

};

// class SpeedMovement
SpeedMovement.prototype = new Movement();
SpeedMovement.prototype.constructor = SpeedMovement;
function SpeedMovement(speed) {
	this.speed = speed;
};
SpeedMovement.prototype.move = function(enemy) {
	enemy.distance -= this.speed;

	if (enemy.direction == 1) {
		enemy.x += this.speed;
		enemy.y = f(enemy.x, this.r) + 60;
		if (enemy.x + enemy.width >= CANVAS_WIDTH - MARGIN) {
			enemy.distance = 0;
		}
	} else {
		enemy.x -= this.speed;
		enemy.y = f(enemy.x, this.r) + 60;
		if (enemy.x <= MARGIN) {
			enemy.distance = 0;
		}
	}

};

SpeedMovement.prototype.draw = function(ctx) {
	// draw shadow
	/*
	 * if(this.speed>=8 && this.speed<=13) { if(this.enemy.direction==1) { var
	 * tmp = ctx.globalAlpha; ctx.globalAlpha = 0.1;
	 * ctx.drawImage(this.enemy.img, this.enemy.x-30, this.enemy.y);
	 * ctx.globalAlpha = 0.4; ctx.drawImage(this.enemy.img, this.enemy.x-15,
	 * this.enemy.y); ctx.globalAlpha = tmp; } else { var tmp = ctx.globalAlpha;
	 * ctx.globalAlpha = 0.1; ctx.drawImage(this.enemy.img, this.enemy.x+30,
	 * this.enemy.y); ctx.globalAlpha = 0.4; ctx.drawImage(this.enemy.img,
	 * this.enemy.x+15, this.enemy.y); ctx.globalAlpha = tmp; } }
	 */

};

function f(x, r) {
	return r * Math.sin(0.1 * x) + r;
}

// start point

var keysDown = {};
var CANVAS_WIDTH = document.getElementById("canvas_fg").width;
var CANVAS_HEIGHT = document.getElementById("canvas_fg").height;
var MARGIN = 15;

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
	// key spacebar, F, f
	if (e.keyCode == 70 || e.keyCode == 102) {
		mainController.fire();
	}
	// key D, d
	if (e.keyCode == 68 || e.keyCode == 100) {
		mainController.strongFire();
	}
	// key S, s
	if (e.keyCode == 83 || e.keyCode == 115) {
		mainController.superFire();
	}

	// secret key U, u
	if (e.keyCode == 85 || e.keyCode == 117) {
		mainController.strongFireNumber = 99;
		mainController.superFireNumber = 99;
	}

}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

var mainController = new MainController();

function loop() {
	if (bgReady == true) {
		if (37 in keysDown) {
			if (mainController.uitox.img.name != "carleft") {
				mainController.resources.loadImage("carleft", mainController.uitox);

			}
			mainController.uitox.increaseSpeed();
			mainController.uitox.moveLeft();
		} else if (39 in keysDown) {
			if (mainController.uitox.img.name != "carright") {
				mainController.resources.loadImage("carright", mainController.uitox);
			}
			mainController.uitox.increaseSpeed();
			mainController.uitox.moveRight();
		} else {
			mainController.uitox.decreaseSpeed();
		}

		mainController.move();

		mainController.draw();

		mainController.detectCollisions();

		mainController.checkVictory();
	} else {
		if (mainController.resources.isReady()) {
			bgReady = true;
			mainController.init();
		}

		this.ctx.font = "bold 64px Arial";
		var text = "背景載入中";
		for (var i = 0; i < bgWaiting; i++) {
			text = text + ".";
		}
		bgWaiting++;
		if (bgWaiting >= 10) {
			bgWaiting = 0;
		}
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0, 0, CANVAS_WIDTH, 100);
		drawShadowText(mainController.ctx, "#aaaaaa", text, 10, 80);

		var now = new Date();
		if (now.getTime() - bgStart.getTime() > 5000) {
			goon = true;
		}
	}

}

/**
 * generate a random integer between from and to, both included.
 * 
 * @param from
 * @param to
 * @returns
 */
function randomIntNumber(from, to) {
	return Math.floor((Math.random() * to) + from);
}

/**
 * a memory-optimized array, which is pushing new instance in the first index of
 * destroyed object or the end of this array.
 */
function MyArray() {
	this.arrays = new Array();
	this.push = function(unit) {
		var found = false;
		for (var i = 0; i < this.arrays.length; i++) {
			if (this.arrays[i].destroyed == true) {
				this.arrays[i] = unit;
				found = true;
				break;
			}
		}
		if (found == false) {
			this.arrays[this.arrays.length] = unit;
		}
	};
	this.scanAll = function(check) {
		for (var i = 0; i < this.arrays.length; i++) {
			check(this.arrays[i]);
		}
	};
};



// start game
var intervalid = setInterval(loop, 100);

function stopInterval() {
	window.clearInterval(intervalid);
}

var goon = false;
var bgStart = new Date();
var bgReady = false;
var bgWaiting = 0;

function startGame() {

	stopInterval();
	mainController.enemyNumber = parseInt(document.getElementById("enemynumber").value);
	if (!(typeof mainController.enemyNumber === 'number') || isNaN(mainController.enemyNumber)) {
		mainController.enemyNumber = 50;
		document.getElementById("enemynumber").value = 50;
	}

	CANVAS_WIDTH = parseInt(document.getElementById("canvaswidth").value);
	if (!(typeof CANVAS_WIDTH === 'number') || isNaN(CANVAS_WIDTH)) {
		CANVAS_WIDTH = 800;
		document.getElementById("canvaswidth").value = 800;
	}

	document.getElementById("canvas_bg").width = CANVAS_WIDTH;
	document.getElementById("canvas_fg").width = CANVAS_WIDTH;
	document.getElementById("canvasdiv").focus();

	if (!bgReady) {
		mainController.resources.init();
	} else {
		mainController.init();
	}

	intervalid = setInterval(loop, 100);

}

startGame();
