var game = new Phaser.Game(800, 480, Phaser.AUTO, 'body', { preload: preload, create: create, update: update });

var sfx = Phaser.Sound;

var player;   // player 1
var playerDead = false;
var fairy;    // player 2
var platforms;

// Groups for particle emitters
var waterfalls;
var fires;
//groups for fairy things
var linePhysicsBody;
var fairyDustGroup;

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

var bmd;       // line graphic
// var lineCoords = []; // line x,y coords


document.addEventListener('mousedown', onDocumentMouseDown, false);

//counts the number of checks between placements of hidden fairy physics blocks
var fairyCounter = 0;
var fairyPrevX;
var fairyPrevY;
var dist = 0;
var dustSize = 0;

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
	[1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	[2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 2, 2, 2]
];
 

function preload() {
    game.load.audio('sfx', ['assets/naturesounds.mp3']);
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
    game.load.image('waterDroplet', 'assets/images/waterDroplet.png');
    game.load.spritesheet('fire', 'assets/images/fireParticle.png', 4, 4    );
    game.load.spritesheet('dust', 'assets/images/fairydust.png', 16, 16);
    game.load.spritesheet('fairy', 'assets/images/fairysheet.png', 32, 32);

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
    sfx = game.add.audio('sfx');
    sfx.play('');

    game.add.sprite(0, 0, 'bg');

    platforms = game.add.group();
    platforms.enableBody = true;

    waterfalls = game.add.group();
    // waterfall physics?
    fairyDustGroup = game.add.group();
    fires = game.add.group();
    linePhysicsBody = game.add.group();
    linePhysicsBody.enableBody = true;
   
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

    // The players and its settings
    player = game.add.sprite(32, game.world.height - 150, 'girl');
    fairy = game.add.sprite(32, game.world.height - 100, 'fairy');
    game.physics.arcade.enable(fairy);
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(linePhysicsBody);


    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.3;
    player.body.gravity.y = 800;
    //player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 8, true);
    player.animations.add('right', [5, 6, 7, 8], 8, true);
    fairy.animations.add('fairyLeft', [0, 1, 2, 3], 8, true);
    fairy.animations.add('fairyRight', [4, 5, 6, 7], 8, true);
    fairy.body.collideWorldBounds = true;
     
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
    fireBox = game.add.sprite(672 - 32, 288);
    game.physics.arcade.enable(fireBox);
    fireBox.renderable = false;
    fireBox.scale.x = 65;
    fireBox.scale.y = 32;
    fireBox.body.immovable = true; 
}
 

function update() {
    if(!playerDead){
        game.physics.arcade.collide(player, platforms);
        fires.forEach(function(fire) {
            game.physics.arcade.collide(player, fire, playerFireCollision);
        }, this);
    }
	
    game.physics.arcade.collide(fairy, platforms);
    game.physics.arcade.collide(linePhysicsBody, waterfalls);

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

    // game.physics.arcade.collide(player, waterfallBox, playerWaterBoxCollision);
    // game.physics.arcade.collide(player, waterfallBox2, playerWaterBoxCollision);

    fakeWaterfalls.forEach(function(fakeWaterfall) {
        game.physics.arcade.collide(fakeWaterfall, fireBox, fireWaterCollision);
    }, this);

    linePhysicsBody.forEach(function(invisibleBody){
       waterfalls.forEach(function(waterfall) {
         game.physics.arcade.collide(invisibleBody, waterfall, waterLineCollision, null, this);
        }, this);
        fakeWaterfalls.forEach(function(fakeWaterfall) {
         game.physics.arcade.collide(invisibleBody, fakeWaterfall, fakeWaterLineCollision, null, this);
        }, this);
    }, this);

    waterfalls.forEach(function(waterfall) {
       game.physics.arcade.collide(player, waterfall, playerWaterCollision);
    
   }, this);


    

    // waterfalls.forEach(function(waterfall) {
    //     fires.forEach(function(fire) {
    //          game.physics.arcade.collide(waterfall, fire, fireWaterCollision, null, this);
    //     }, this);
    // }, this);

    //game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);
    
    updateLine();
    updateWaterfalls();
    moveFairy();  
    // updateFires();  
}

// function playerWaterBoxCollision(player, waterfallBox) {
//     player.body.velocity.x = 0;
// }

function waterPlatformCollision(waterfall, platform) {
    if(waterfall.x - platform.x < 16) {
        waterfall.body.velocity.x = -20;
    } else {
        waterfall.body.velocity.x = 20;
    }

}

function fairyDustCollision(fairy, linePhysicsBody){
    fairy.body.velocity.setTo(0,0);
}

function playerFireCollision(player, fire) {
    player.body.bounce.y = 0.7;
    playerDead=true;


}

function playerWaterCollision(player, waterfall) {
    player.body.velocity.x = 0;
    player.body.velocity.y += 10;

}

function fireWaterCollision(fakeWaterfall, fireBox) {
    // waterFireCount++;

    // if(waterFireCount > 20) {
    //     fires.destroy();
    //     fireBox.destroy();
    // }

    fakeWaterfalls.destroy();
    fires.destroy();
    // fireBox.destroy();
    // fireBox.kill();
}

function waterLineCollision(invisibleBody, waterfall){
    waterfall.body.velocity.y = -20;
    if(waterfall.x - invisibleBody.x < 16) {
        waterfall.body.velocity.x = -150;
    } else {
        waterfall.body.velocity.x = 150;
    }
    waterfall.gravity = 100;
}

function fakeWaterLineCollision(invisbleBody, fakeWaterfall){
    fakeWaterfall.body.velocity.y = -20;
    if(fakeWaterfall.x - invisbleBody.x < 16) {
        fakeWaterfall.body.velocity.x = -150;
    } else {
        fakeWaterfall.body.velocity.x = 150;
    }
    fakeWaterfall.gravity = 100;
}

function updateLine() {     
    var x = fairy.body.x;
    var y = fairy.body.y; 
    
    if (game.input.mousePointer.isDown) {
    	if(!mouseWasDown) {
            fairyDustGroup.destroy(true, true);
            linePhysicsBody.destroy(true, true);
            dustSize=0;
            fairyPrevX = x;
            fairyPrevY = y;

    		bmd.clear();
    		// bmd.update(0, 0, 800, 480);

    		bmd = game.add.bitmapData(800, 480);
   		       bmdLineSprite = game.add.sprite(0, 0, bmd); 

    		bmd.ctx.beginPath();
    	    bmd.ctx.strokeStyle = "white";

            bmd.ctx.lineTo(x, y);

            var fairyDust = fairyDustGroup.create(x, y, '');
            
            // fairyDust.animations.add('twinkle', [0, 1, 2, 3], 2, true);
            // fairyDust.animations.play('twinkle');
            var invisibleBody = linePhysicsBody.create(x, y, '');
            invisibleBody.scale.x = .5;
            invisibleBody.scale.y = .5;
            invisibleBody.body.immovable = true;

            // lineCoords.push({x:x, y:y}); // add x,y coord to line data array
	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;

	        mouseWasDown = true;
        } else if(dustSize>10) {
        } else if(x != fairyPrevX || y != fairyPrevY) {

 		    bmd.ctx.lineTo(x, y);
            // lineCoords.push({x:x, y:y});
           
            dist = dist + Math.abs(x - fairyPrevX) + Math.abs(y - fairyPrevY);
            
            fairyPrevX = x;
            fairyPrevY = y;
             
            if (dist < 16){
                // do nothing
                // fairyCounter++;
            } else {
                var invisibleBody = linePhysicsBody.create(x, y, '');
                invisibleBody.scale.x = .5;
                invisibleBody.scale.y = .5;
                invisibleBody.body.immovable = true;

                var fairyDust = fairyDustGroup.create(x, y, '');
                // fairyDust.animations.add('twinkle', shuffleArray([0, 1, 2, 3]), 2, true);
                // fairyDust.animations.play('twinkle');
                // fairyCounter = 0;
                dist = 0;
                dustSize++;
           }
	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;
        } 
    }  

    bmd.render(); // display line graphic
    
}

function createFakeWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 10);
    waterfall.width = width;
    waterfall.gravity = 100;

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


function moveFairy() {
    var distance = Math.abs(game.input.x-fairy.body.x)+Math.abs(game.input.y-fairy.body.y);
    var speed = Math.min(200, Math.max(80,2*distance));
    game.physics.arcade.moveToPointer(fairy, speed);
    // Stop moving when fairy reaches mouse
    
    if (distance<20) {
        fairy.body.velocity.setTo(0, 0);
    }

    if (fairy.body.velocity.x == 0) {
        // do nothing
    } else if (fairy.body.velocity.x < 0) {
        // fairy.body.velocity.x = -150;
        fairy.animations.play('fairyLeft');
        // prevFairyDir = 'fairyLeft'; 
    } else {
        // player.body.velocity.x = 150;
        fairy.animations.play('fairyRight');
        // prevFairyDir = 'right';
    }
}


function updateWaterfalls() {
	waterfalls.forEach(function(waterfall) {
    	waterfall.makeParticles('waterDroplet', 1);
    }, this);
}

// function updateFires() {
// 	fires.forEach(function(fire) {
// 		var texture = pickRandTexture(fireTextures);
// 		console.log(texture);
//     	fire.makeParticles(texture, 100);
//     }, this);
// }


function onDocumentMouseDown(event) {
	event.preventDefault();
	mouseWasDown = false;
}


function pickRandTexture(textures) {
    return textures[Math.floor(Math.random()*textures.length)];
}


/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

