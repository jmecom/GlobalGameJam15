var game = new Phaser.Game(800, 480, Phaser.AUTO, 'body', { preload: preload, create: create, update: update });

var player;
var platforms;

// Groups for particle emitters
var waterfalls;
var fires;

var waterFireCount = 0;
var waterfallBox, waterfallBox2;
var fireBox;
var fakeWaterfalls;

// Direction the girl is facing
var direction = 'left';

var dirtTextures = [];
var dirtGrassTextures = [];
var boulderTextures = [];
var boulderGrassTextures = [];

var bmd; // line

document.addEventListener('mousedown', onDocumentMouseDown, false);

// 0 = blank
// 1 = platform top
// 2 = platform bottom
// 3 = boulder
// 4 = boulder with grass
// 5 = tree
var levelOnePlatforms =
[	 
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 2, 2, 2]
];
 

function preload() {
	game.load.spritesheet('girl', 'assets/images/girlSprite.png', 32, 64);
	game.load.image('boulder1', 'assets/images/boulder1.png');
	game.load.image('boulder2', 'assets/images/boulder2.png');
	game.load.image('boulder3', 'assets/images/boulder3.png');
	game.load.image('grassboulder1', 'assets/images/grassboulder1.png');
	game.load.image('grassboulder2', 'assets/images/grassboulder2.png');
	game.load.image('grassboulder3', 'assets/images/grassboulder3.png');
	game.load.image('grassdirt1', 'assets/images/grassdirt1.png');
	game.load.image('grassdirt2', 'assets/images/grassdirt2.png');
	game.load.image('grassdirt3', 'assets/images/grassdirt3.png');
	game.load.image('dirt1', 'assets/images/dirt1.png');
	game.load.image('dirt2', 'assets/images/dirt2.png');
	game.load.image('dirt3', 'assets/images/dirt3.png');
	game.load.image('tree1', 'assets/images/tree1.png');
	game.load.image('bg', 'assets/images/bg.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.image('waterDroplet', 'assets/images/water3.png');
    game.load.spritesheet('fire', 'assets/images/fireParticle.png', 4, 4);
    //game.load.spritesheet('dude', 'assets/images/dude.png', 32, 64);

    dirtTextures.push('dirt1');
    dirtTextures.push('dirt2');
    dirtTextures.push('dirt3');
    dirtGrassTextures.push('grassdirt1');
    dirtGrassTextures.push('grassdirt2');
    dirtGrassTextures.push('grassdirt3');
    boulderTextures.push('boulder1');
    boulderTextures.push('boulder2');
    boulderTextures.push('boulder3');
    boulderGrassTextures.push('grassboulder1');
    boulderGrassTextures.push('grassboulder2');
    boulderGrassTextures.push('grassboulder3');
  

}
 

function create() {
    //game.physics.startSystem(Phaser.Physics.ARCADE); 

    game.add.sprite(0, 0, 'bg');

    platforms = game.add.group();
    platforms.enableBody = true;

    waterfalls = game.add.group();
    // waterfall physics?
    fires = game.add.group();
   
    for (var col = 0; col < 25; col++) {
        for (var row = 0 ; row < 15; row++) {
            // Top level
            if (levelOnePlatforms[row][col] == 1) {
            	var texture = pickRandTexture(dirtGrassTextures);
                var platform = platforms.create(col*32, row*32, texture);
                platform.body.immovable = true;    
            // Bottom level      
            } else if (levelOnePlatforms[row][col] == 2) {
            	var texture = pickRandTexture(dirtTextures);
                var platform = platforms.create(col*32, row*32, texture);
                platform.body.immovable = true;    
            // Boulders
            } else if (levelOnePlatforms[row][col] == 3) {
            	var texture = pickRandTexture(boulderTextures);
                var platform = platforms.create(col*32, row*32, texture);
                platform.body.immovable = true;
            // Boulders with grass
            } else if (levelOnePlatforms[row][col] == 4) {
            	var texture = pickRandTexture(boulderGrassTextures);
                var platform = platforms.create(col*32, row*32, texture);
                platform.body.immovable = true;
            // Tree
            } else if (levelOnePlatforms[row][col] == 5) {
                var platform = platforms.create(col*32, row*32, 'tree1');
                platform.body.immovable = true;
            }
        }
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'girl');
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.3;
    player.body.gravity.y = 800;
    //player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 8, true);
    player.animations.add('right', [5, 6, 7, 8], 8, true);
     
    // Set up the line
    bmd = game.add.bitmapData(800, 480);
    bmdLineSprite = game.add.sprite(0, 0, bmd); 

    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle += "white";

    // Left waterfall
    waterfalls.add(createWaterfall(336, 64, 160, 200));	

    // Right waterfall
    waterfalls.add(createWaterfall(545, 64, 128, 200));	

    // Invisible waterfall to detect collisions
    fakeWaterfalls = game.add.group();
    fakeWaterfalls.add(createFakeWaterfall(336, 64, 160, 50));
    fakeWaterfalls.add(createFakeWaterfall(545, 64, 128, 50));

    // waterfall hit box
    waterfallBox = game.add.sprite(336 -80, 64);
    game.physics.arcade.enable(waterfallBox);
    waterfallBox.renderable = false;
    waterfallBox.scale.x = 160;
    waterfallBox.scale.y = game.world.height - 64;
    waterfallBox.body.immovable = true; 
    
    waterfallBox2 = game.add.sprite(545-80, 64);
    game.physics.arcade.enable(waterfallBox2);
    waterfallBox2.renderable = false;
    waterfallBox2.scale.x = 128;
    waterfallBox2.scale.y = game.world.height - 64;
    waterfallBox2.body.immovable = true; 

    // // Fire particle emitters 
    // fires.add(createFire(665, 288, 32, 100));
    fires.add(createFire(672, 288, 64, 200));    

    // Fire hit box
    fireBox = game.add.sprite(545 - 32, 288);
    game.physics.arcade.enable(fireBox);
    fireBox.renderable = false;
    fireBox.scale.x = 65;
    fireBox.scale.y = 32;
    fireBox.body.immovable = true; 
}
 

function update() {
	game.physics.arcade.collide(player, platforms);

	cursors = game.input.keyboard.createCursorKeys();

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        // Check if player is in world bounds
        if(player.x >= 0) {
            // Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
            direction = 'left'; 
        }  
    } else if (cursors.right.isDown) {
        // Check if player is in world bounds
        if(player.x <= game.world.width - 2*player.body.halfWidth) {
            // Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
            direction = 'right';
        }
    } else {
        // Stand still
        player.animations.stop();

        if(player.y < 0) {
            player.kill();
        }

        if(direction == 'left') {
        	player.frame = 4;
        } else if(direction == 'right') {
        	player.frame = 9;
        }   
    }
    
    // Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }

    game.physics.arcade.collide(player, waterfallBox, playerWaterBoxCollision);
    game.physics.arcade.collide(player, waterfallBox2, playerWaterBoxCollision);

    fakeWaterfalls.forEach(function(fakeWaterfall) {
        game.physics.arcade.collide(fakeWaterfall, fireBox, fireWaterCollision);
    }, this);

    //waterfalls.forEach(function(waterfall) {
    //    game.physics.arcade.collide(player, waterfall, playerWaterCollision);
     //   game.physics.arcade.collide(waterfall, platforms, waterPlatformCollision, null, this);
        
        // fires.forEach(function(fire) {
        //      game.physics.arcade.collide(waterfall, fires, fireWaterCollision, null, this);
        // }, this);
    
   //}, this);

    // fires.forEach(function(fire) {
    //     game.physics.arcade.collide(player, fire, playerFireCollision);
    // }, this);

    // waterfalls.forEach(function(waterfall) {
    //     fires.forEach(function(fire) {
    //          game.physics.arcade.collide(waterfall, fire, fireWaterCollision, null, this);
    //     }, this);
    // }, this);

    //game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);
    
    updateLine();
    updateWaterfalls();  
    // updateFires();  
}

function playerWaterBoxCollision(player, waterfallBox) {
    player.body.velocity.x = 0;
}

function waterPlatformCollision(waterfall, platform) {
    if(waterfall.x - platform.x < 16) {
        waterfall.body.velocity.x = -20;
    } else {
        waterfall.body.velocity.x = 20;
    }

}

function playerFireCollision(player, fire) {
    player.body.velocity.y = -20;
}

function playerWaterCollision(player, group) {
    player.body.velocity.x = 0;
    player.x -= 10;
}

function fireWaterCollision(fakeWaterfall, fireBox) {
    // waterFireCount++;

    // if(waterFireCount > 20) {
    //     fires.destroy();
    //     fireBox.destroy();
    // }

    fakeWaterfalls.destroy;
    fires.destroy();
    fireBox.destroy();
}

function updateLine() {     
    if (game.input.mousePointer.isDown) {
    	if(!mouseWasDown) {
    		
    		bmd.clear();
    		// bmd.update(0, 0, 800, 480);

    		bmd = game.add.bitmapData(800, 480);
   		    bmdLineSprite = game.add.sprite(0, 0, bmd); 

    		bmd.ctx.beginPath();
    	    bmd.ctx.strokeStyle = "white";

	        bmd.ctx.lineTo(game.input.x, game.input.y);
	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;
	        mouseWasDown = true;
        } else {	
 		    bmd.ctx.lineTo(game.input.x, game.input.y);

	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;
        }
    }  
    bmd.render();
}

function createFakeWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 10);
    waterfall.width = width;
    waterfall.gravity = 20;

    waterfall.makeParticles('');
    waterfall.renderable = false;

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(190,200);
    waterfall.start(false, 2000, .1, false);
    return waterfall;
}

function createWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 1);
    waterfall.width = width;
    waterfall.gravity = 20;
    waterfall.makeParticles('waterDroplet');

    // leftWaterfall.setRotation(-100, 100);  
    // waterfall.gravity.y = 0;

    waterfall.minParticleScale = 0.75;
    waterfall.maxParticleScale = 2;
    //leftWaterfall.minParticleScale = 0.5;
    // leftWaterfall.maxParticleScale = 0.5;

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(10, 200);
    waterfall.start(false, 5000, .2, false);
    return waterfall;
}


function createFire(x, y, width, maxParticles) {
    var fire = game.add.emitter(x, y, 100);
    fire.width = width;
    fire.makeParticles('fire', [0, 1, 2]);
    fire.gravity.y = -20;

    fire.minParticleScale = 0.75;
    fire.maxParticleScale = 1.5;

    fire.setXSpeed(-5, 5);  
    fire.setYSpeed(-100, -50);
    fire.start(false, 500, 1, false);
    return fire;
}


function updateWaterfalls() {
	waterfalls.forEach(function(waterfall) {
    	waterfall.makeParticles('waterDroplet', 1);
    }, this);
}

function updateFires() {
	fires.forEach(function(fire) {
		var texture = pickRandTexture(fireTextures);
		console.log(texture);
    	fire.makeParticles(texture, 100);
    }, this);
}


function onDocumentMouseDown(event) {
	event.preventDefault();
	mouseWasDown = false;
}


function pickRandTexture(textures) {
    return textures[Math.floor(Math.random()*textures.length)];
}

function calcStraightLine (startCoordinates, endCoordinates) {
    var coordinatesArray = new Array();
    // Translate coordinates
    var x1 = startCoordinates.left;
    var y1 = startCoordinates.top;
    var x2 = endCoordinates.left;
    var y2 = endCoordinates.top;
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push(new Coordinates(y1, x1));
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      coordinatesArray.push(new Coordinates(y1, x1));
    }
    // Return the result
    return coordinatesArray;
}

// function convertToGameCoords(x, y, width, height) {
//     return {x:32*x, y:32*y, width:width, height:height};
// }

