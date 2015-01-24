var game = new Phaser.Game(800, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var waterfalls;


// Variables for line drawing
var line = null;
var lineSprite = null;
var lineGraphic = null;
var mouseWasDown = false;
var linePath = null;
var linePathIndex = -1;
var linePathSpriteIndex = -1;

var bmd;

var count;

document.addEventListener('mousedown', onDocumentMouseDown, false);
// setInterval(function () {updateWaterfalls()}, 3000);

// Indices for level one's platforms   
var levelOnePlatforms = [{x:0, y:13, width:7, height:2}, {x:9, y:13, width:2, height:1}, {x:13, y:13, width:2, height:1}, {x:16, y:14, width:2, height:1}, {x:19, y:13, width:7, height:2}, {x:20, y:9, width:2, height:1}, {x:23, y:11, width:2, height:1}, {x:23, y:7, width:2, height:1}, {x:0, y:0, width:1, height:1}];


// // 0 = blank
// // 1 = platform top
// // 2 = platform bottom
// var levelOnePlatform =
// [	 
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
// 	[2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2]
// ];
 

function preload() {
	game.load.image('tile', 'assets/images/grassdirt1.png');
	game.load.image('sky', 'assets/images/sky.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.image('waterDroplet', 'assets/images/waterDroplet.png');
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
    
    for (var i = 0; i < levelOnePlatforms.length; i++) {
    	var platform = levelOnePlatforms[i];
    	levelOnePlatforms[i] = convertToGameCoords(platform.x, platform.y, platform.width, platform.height);
    }
}
 

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); 

    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    waterfalls = game.add.group();
    // waterfall physics?
   
    // Place platforms for the level
    for (var i = 0; i < levelOnePlatforms.length; i++) {
    	var platform = levelOnePlatforms[i];
    	var ledge = platforms.create(platform.x, platform.y, 'tile');
        ledge.scale.setTo(platform.width, platform.height);
        ledge.body.immovable = true;
    }
     
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    // Set up the line
    line = game.add.group();
    line.enableBody = true;
    lineGraphic = game.add.graphics(0, 0);
    lineSprite = game.add.sprite(100, 100, 'star');
    lineSprite.anchor.setTo(0.5, 0.5);
    lineGraphic.lineStyle(4, 0xFF0000, 1); 
    game.physics.enable(lineSprite, Phaser.Physics.ARCADE);
    

    bmd = game.add.bitmapData(800, 480);
    bmdLineSprite = game.add.sprite(0, 0, bmd); 

    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle += "white";

    // left waterfall, using layers for multiple particles
    waterfalls.add(createWaterfall(304, 32, 160, 400));	
    waterfalls.add(createWaterfall(304, 32, 160, 400));
    waterfalls.add(createWaterfall(304, 32, 160, 400));

}
 

function update() {

	game.physics.arcade.collide(player, platforms);
	cursors = game.input.keyboard.createCursorKeys();

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        // Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        // Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        // Stand still
        player.animations.stop();
        player.frame = 4;
    }
    
    // Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }
    
    updateLine();
    updateWaterfalls();    
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


function createWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 1);
    waterfall.width = width;
    // leftWaterfall.height = 448;
    waterfall.makeParticles('waterDroplet');
    // leftWaterfall.setRotation(-100, 100);  
    waterfall.gravity.y = 50;

    // leftWaterfall.minParticleScale = 0.5;
    // leftWaterfall.maxParticleScale = 0.5;

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(10, 10);
    waterfall.start(false, 0, 1, false);
    return waterfall;
}

function updateWaterfalls() {
	waterfalls.forEach(function(waterfall) {
    	waterfall.makeParticles('waterDroplet', 1);
    }, this);
}



function onDocumentMouseDown(event) {
	event.preventDefault();
	mouseWasDown = false;
}

function convertToGameCoords(x, y, width, height) {
    return {x:32*x, y:32*y, width:width, height:height};
}

