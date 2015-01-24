var player;
var platforms;


// 0 = blank, special sprite, or background image
// 1 = stone
// 2 = pillar
// 3 = tree
var levelTwoPlatforms =
[    
    [1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


// Groups for particle emitters
var waterfalls;
var fires;


// Direction the girl is facing
var direction = 'left';

// var dirtTextures = [];
// var dirtGrassTextures = [];

var bmd; // line

document.addEventListener('mousedown', onDocumentMouseDown, false);
 


function preload() {



    game.load.spritesheet('girl', 'stonePlaceholder.png', 32, 64);

    game.load.image('stone', 'stonePlaceholder.png');
    game.load.image('pillar', 'pillarPlaceholder.png');
    game.load.image('tree', 'treePlaceholder.png');



    game.load.image('fire', 'firePlaceholder.png');
    game.load.image('waterDroplet', 'firePlaceholder.png');
    
    // game.load.image('grassdirt1', 'assets/images/grassdirt1.png');
    // game.load.image('grassdirt2', 'assets/images/grassdirt2.png');
    // game.load.image('grassdirt3', 'assets/images/grassdirt3.png');
    // game.load.image('dirt1', 'assets/images/dirt1.png');
    // game.load.image('dirt2', 'assets/images/dirt2.png');
    // game.load.image('dirt3', 'assets/images/dirt3.png');
    game.load.image('bg', 'backgroundPlaceholder.png');
    // game.load.image('ground', 'assets/images/platform.png');
    // game.load.image('star', 'assets/images/star.png');
    //game.load.spritesheet('dude', 'assets/images/dude.png', 32, 64);

    // dirtTextures.push('dirt1');
    // dirtTextures.push('dirt2');
    // dirtTextures.push('dirt3');
    // dirtGrassTextures.push('grassdirt1');
    // dirtGrassTextures.push('grassdirt2');
    // dirtGrassTextures.push('grassdirt3');   
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
            if (levelTwoPlatforms[row][col] == 1) {
                // var texture = pickRandTexture(dirtGrassTextures);
                var texture = 'stone';
                var ledge = platforms.create(col*32, row*32, texture);
                ledge.body.immovable = true;    
            // Bottom level      
            } else if (levelTwoPlatforms[row][col] == 2) {
                // var texture = pickRandTexture(dirtTextures);
                var texture = 'pillar';
                var ledge = platforms.create(col*32, row*32, texture);
                ledge.body.immovable =  true;    
            } else if (levelTwoPlatforms[row][col] == 3) {
                var texture = 'tree';
                var ledge = platforms.create(col*32, row*32, texture);
                ledge.body.immovable =  true;  
            }
        }
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 120, 'girl');
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 8, true);
    player.animations.add('right', [5, 6, 7, 8], 8, true);
     
    // Set up the line
    bmd = game.add.bitmapData(800, 480);
    bmdLineSprite = game.add.sprite(0, 0, bmd); 

    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle += "white";

    // Left waterfall, using layers for multiple particles
    waterfalls.add(createWaterfall(game.world.width-75, 0, 150, 400)); 
    // waterfalls.add(createWaterfall(336, 0, 160, 400));
    // waterfalls.add(createWaterfall(336, 0, 160, 400));

    // Right waterfall, using layers for multiple particles
    // waterfalls.add(createWaterfall(545, 64, 128, 400)); 
    // waterfalls.add(createWaterfall(504, 0, 140, 400));
    // waterfalls.add(createWaterfall(504, 0, 140, 400));

    // Fire particle emitters 
    fires.add(createFire(240, game.world.height-30, 240, 100));
    fires.add(createFire(544, game.world.height-30, 180, 100));    
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
    waterfall.gravity = 20;
    // leftWaterfall.height = 448;
    waterfall.makeParticles('waterDroplet');
    // leftWaterfall.setRotation(-100, 100);  
    // waterfall.gravity.y = 0;

    // leftWaterfall.minParticleScale = 0.5;
    // leftWaterfall.maxParticleScale = 0.5;

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(60, 100);
    waterfall.start(false, 1000, 1, false);
    return waterfall;
}


function createFire(x, y, width, maxParticles) {
    var fire = game.add.emitter(x, y, 100);
    fire.width = width;
    fire.makeParticles('fire');
    fire.gravity.y = -20;

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
        fire.makeParticles('fire', 100);
    }, this);
}


function onDocumentMouseDown(event) {
    event.preventDefault();
    mouseWasDown = false;
}


function pickRandTexture(textures) {
    return textures[Math.floor(Math.random()*textures.length)];
}