var game = new Phaser.Game(800, 480, Phaser.AUTO, 'body', { preload: preload, create: create, update: update });

var player;   // player 1
var fairy;    // player 2
var platforms;

// Groups for particle emitters
var waterfalls;
var fires;


// Direction the girl is facing
var direction = 'left';

var dirtTextures = [];
var dirtGrassTextures = [];
var boulderTextures = [];
var boulderGrassTextures = [];

var bmd;       // line graphic
var lineCoords = []; // line x,y coords
var linePhysicsBody;

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
    game.load.image('waterDroplet', 'assets/images/waterDroplet.png');
    game.load.image('fire', 'assets/images/fireParticle.png');
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

    game.add.sprite(0, 0, 'bg');

    platforms = game.add.group();
    platforms.enableBody = true;

    waterfalls = game.add.group();
    // waterfall physics?
    fires = game.add.group();
    linePhysicsBody = game.add.group();
   
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

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = true;

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

    // Left waterfall, using layers for multiple particles
    waterfalls.add(createWaterfall(336, 64, 160, 400));	
    // waterfalls.add(createWaterfall(336, 0, 160, 400));
    // waterfalls.add(createWaterfall(336, 0, 160, 400));

    // Right waterfall, using layers for multiple particles
    waterfalls.add(createWaterfall(545, 64, 128, 400));	
    // waterfalls.add(createWaterfall(504, 0, 140, 400));
    // waterfalls.add(createWaterfall(504, 0, 140, 400));

    // Fire particle emitters 
    fires.add(createFire(656, 288, 32, 100));
    fires.add(createFire(688, 288, 32, 100));    
}
 

function update() {
	game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(fairy, platforms);
	cursors = game.input.keyboard.createCursorKeys();

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        // Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
        direction = 'left';	
    } else if (cursors.right.isDown) {
        // Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
        direction = 'right';
    } else {
        // Stand still
        player.animations.stop();

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
    
    updateLine();
    updateWaterfalls();
    moveFairy();  
    // updateFires();  
}


function updateLine() {     
    var x = fairy.body.x;
    var y = fairy.body.y;

    if (game.input.mousePointer.isDown) {
    	if(!mouseWasDown) {
    		
    		bmd.clear();
    		// bmd.update(0, 0, 800, 480);

    		bmd = game.add.bitmapData(800, 480);
   		    bmdLineSprite = game.add.sprite(0, 0, bmd); 

    		bmd.ctx.beginPath();
    	    bmd.ctx.strokeStyle = "white";

	        // bmd.ctx.lineTo(game.input.x, game.input.y);
            bmd.ctx.lineTo(x, y);
            var invisLinePlatform = linePhysicsBody.create(x, y, 'waterDroplet');
            lineCoords.push({x:x, y:y}); // add x,y coord to line data array
	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;
	        mouseWasDown = true;
        } else {	
 		    bmd.ctx.lineTo(x, y);
            lineCoords.push({x:x, y:y});
            var invisLinePlatform = linePhysicsBody.create(x, y, 'waterDroplet');
	        bmd.ctx.lineWidth = 2;
	        bmd.ctx.stroke();
	        bmd.dirty = true;
        }
    }  

    bmd.render(); // display line graphic
    
}


function createWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 1);
    waterfall.width = width;
    waterfall.gravity = 20;
    waterfall.makeParticles('waterDroplet');

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(60, 100);
    waterfall.start(false, 5000, 1, false);
    return waterfall;
}


function createFire(x, y, width, maxParticles) {
    var fire = game.add.emitter(x, y, 100);
    fire.width = width;
    fire.makeParticles('fire', [0, 1, 2]);
    fire.gravity.y = -20;

    fire.setXSpeed(-5, 5);  
    fire.setYSpeed(-100, -50);
    fire.start(false, 500, 1, false);
    return fire;
}


function moveFairy() {

    var distance = Math.abs(game.input.x-fairy.body.x)+Math.abs(game.input.y-fairy.body.y);
    var speed = Math.max(80,2*distance);
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

