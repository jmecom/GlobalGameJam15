var game = new Phaser.Game(800, 480, Phaser.AUTO, 'body', { preload: preload, create: create, update: update });

var sfx = Phaser.Sound;

var timeCheck;

var player;   // player 1
var playerDead = false;
var fairy;    // player 2
var fairyOnFire = false; 
var fairyFire;

var platforms;
var treasures;

var lever;
var leverOn = false;

var flammable;

// Groups for particle emitters
var waterfalls;
var fires;
//groups for fairy things
var linePhysicsBody;
var fairyDustGroup;

var fallingBlock;

var waterFireCount = 0;
var waterfallBox, waterfallBox2;
var fireBoxLeft;
var fireBoxRight;

// Direction the girl is facing
var direction = 'left';

var boulderTextures = [];
var boulderGrassTextures = [];

var bmd;       // line graphic`

document.addEventListener('mousedown', onDocumentMouseDown, false);

//counts the number of checks between placements of hidden fairy physics blocks
var fairyCounter = 0;
var fairyPrevX;
var fairyPrevY;
var dist = 0;
var dustSize = 0;


// 0 = blank
// 1 = ground + grass
// 2 = ground
// 3 = leaves
// 4 = pillar
// 5 = waterfall
// 6 = turner under waterfall
// 7 = lever
// 8 = chest
var levelTwoPlatforms =
[    
    [2, 2, 2, 2, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 0, 0, 2],
    [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2],
    [2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];


function preload() {
        // game.destroy(true, true);
        game.load.audio('sfx', ['assets/Firesong.mp3']);
        game.load.spritesheet('girl', 'assets/images/girlSprite.png', 32, 64);
        game.load.image('treasure', 'assets/images/chest.png');
        game.load.image('boulder1', 'assets/images/boulder1.png');
        game.load.image('boulder2', 'assets/images/boulder2.png');
        game.load.image('boulder3', 'assets/images/boulder3.png');
        game.load.image('grassboulder1', 'assets/images/grassboulder1.png');
        game.load.image('grassboulder2', 'assets/images/grassboulder2.png');
        game.load.image('grassboulder3', 'assets/images/grassboulder3.png');
        game.load.image('tree1', 'assets/images/tree1.png');
        game.load.image('bg', 'assets/images/bg2.png');
        game.load.image('ground', 'assets/images/platform.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('leverOff', 'assets/images/leverOff.png');
        game.load.image('leverOn', 'assets/images/leverOn.png');
        game.load.image('pillar', 'assets/images/pillar.png');
        game.load.image('platform', 'assets/images/platform.png');
        game.load.image('waterDroplet', 'assets/images/water3.png');
        game.load.image('waterfall', 'assets/images/waterfall.png');
        game.load.image('nonburntree', 'assets/images/nonburnttree.png');
        game.load.image('treeonfire', 'assets/images/treeonfire.png');
        game.load.spritesheet('fire', 'assets/images/fireParticle.png', 4, 4);
        game.load.spritesheet('dust', 'assets/images/fairydust.png', 16, 16);
        game.load.spritesheet('fairy', 'assets/images/fairysheet.png', 32, 32);


        boulderTextures.push('boulder1');
        boulderTextures.push('boulder2');
        boulderTextures.push('boulder3');
        boulderGrassTextures.push('grassboulder1');
        boulderGrassTextures.push('grassboulder2');
        boulderGrassTextures.push('grassboulder3');

        // this.create();
}

function create() {
        // platforms.destroy(true,true);
        // console.log('hello from create');
        //game.physics.startSystem(Phaser.Physics.ARCADE); 
        sfx = game.add.audio('sfx');
        sfx.play('');

        game.add.sprite(0, 0, 'bg');

        platforms = game.add.group();
        platforms.enableBody = true;

        treasures=game.add.group();
        treasures.enableBody = true;

        waterfalls = game.add.group();
        fires = game.add.group();
        levers = game.add.group();
        levers.enableBody = true;

        flammable = game.add.group();
        flammable.enableBody = true;

        fairyDustGroup = game.add.group();
       
        linePhysicsBody = game.add.group();
        linePhysicsBody.enableBody = true;
        

        for (var col = 0; col < 25; col++) {
            for (var row = 0 ; row < 15; row++) {
                // Ground grass
                if (levelTwoPlatforms[row][col] == 1) {
                    var texture = pickRandTexture(boulderGrassTextures);
                    var platform = platforms.create(col*32, row*32, texture);
                    platform.body.immovable = true;    
                // Ground      
                } else if (levelTwoPlatforms[row][col] == 2) {
                    var texture = pickRandTexture(boulderTextures);
                    var platform = platforms.create(col*32, row*32, texture);
                    platform.body.immovable = true;    
                // Leaves
                } else if (levelTwoPlatforms[row][col] == 3) {
                    var tree = flammable.create(col*32, row*32, 'nonburntree');
                    tree.body.immovable = true;
                // Pillar
                } else if (levelTwoPlatforms[row][col] == 4) {
                    fallingBlock = game.add.sprite(col*32, row*32, 'pillar');
                    game.physics.arcade.enable(fallingBlock);
                    fallingBlock.body.immovable = true;
                // Waterfall decoration
                } else if (levelTwoPlatforms[row][col] == 5) {
                    var platform = platforms.create(col*32, row*32, 'waterfall');
                    platform.body.immovable = true;
                // nvm
                } else if (levelTwoPlatforms[row][col] == 6) {
                    // unused
                // Lever
                } else if (levelTwoPlatforms[row][col] == 7) {
                    lever = game.add.sprite(col*32, row*32, 'leverOff');
                    game.physics.arcade.enable(lever);
                    lever.body.immovable = true;
                // Chest
                } else if (levelTwoPlatforms[row][col] == 8) {
                    var treasure = treasures.create(col*32, row*32, 'treasure');
                    treasure.body.immovable = true;
                }
            }
        }

        // The players and its settings
        player = game.add.sprite(32, game.world.height - 288, 'girl');
        fairy = game.add.sprite(32, game.world.height - 300, 'fairy');

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

        // Create fire emitters
        fires.add(createFire(256, 448, 256, 1000));
        fires.add(createFire(548, 448, 192, 1000));        

        // Fire hit box
        
        fireBoxLeft = game.add.sprite(128, 416);
        fireBoxRight = game.add.sprite(448, 416);

        game.physics.arcade.enable(fireBoxLeft);
        game.physics.arcade.enable(fireBoxRight);
        
        fireBoxLeft.renderable = false;
        fireBoxRight.renderable = false;
        
        fireBoxLeft.scale.x = 256/fireBoxLeft.width;
        fireBoxLeft.scale.y = 32/fireBoxLeft.height;

        fireBoxRight.scale.x = 198/fireBoxRight.width;
        fireBoxRight.scale.y = 32/fireBoxRight.height;
        
        fireBoxLeft.body.immovable = true; 
        fireBoxRight.body.immovable = true; 

        // Create waterfalls
        waterfalls.add(createWaterfall(720, 64, 96, 400));  
}


function update() {
    if(!playerDead){
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, lever, playerLeverCollision);
        // game.physics.arcade.collide(player, treasures, moveToNextLevel);
        fires.forEach(function(fire) {
            game.physics.arcade.collide(player, fire, playerFireCollision);
            game.physics.arcade.collide(fairy, fire, fairyFireCollision);
        }, this);
    }
    
    game.physics.arcade.collide(fairy, platforms);

    if (fairyOnFire) {
        game.physics.arcade.collide(fairy, flammable, fairyFlammableCollision);
    }

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

    linePhysicsBody.forEach(function(invisibleBody){
       waterfalls.forEach(function(waterfall) {
         game.physics.arcade.collide(invisibleBody, waterfall, waterLineCollision, null, this);
        }, this);

    }, this);

    waterfalls.forEach(function(waterfall) {
       game.physics.arcade.collide(player, waterfall, playerWaterCollision);
       game.physics.arcade.collide(fairy, waterfall, fairyWaterCollision);  
       game.physics.arcade.collide(waterfall, fireBoxLeft, fireWaterCollision); 
       game.physics.arcade.collide(waterfall, fireBoxRight, fireWaterCollision); 
    }, this);

    if (game.time.now - timeCheck > 3000 && game.time.now - timeCheck < 4000) {
        flammable.destroy();
        fallingBlock.body.immovable = false;
        fallingBlock.body.velocity.y = 350;    
    }
    // fallingBlock.body.immovable = true;
    game.physics.arcade.collide(fallingBlock, platforms, fallingblockPlatformCollision);
    game.physics.arcade.collide(fallingBlock, player);
    
    updateLine();
    if(leverOn) {
        updateWaterfalls();
    }
    moveFairy();  
};


function createWaterfall(x, y, width, maxParticles) {
    var waterfall = game.add.emitter(x, y, 1);
    waterfall.width = width;
    waterfall.gravity = 100;
    waterfall.makeParticles('waterDroplet');

    // leftWaterfall.setRotation(-100, 100);  
    // waterfall.gravity.y = 0;

    waterfall.minParticleScale = 0.75;
    waterfall.maxParticleScale = 2;
    //leftWaterfall.minParticleScale = 0.5;
    // leftWaterfall.maxParticleScale = 0.5;

    waterfall.setXSpeed(0, 0);  
    waterfall.setYSpeed(10, 200);
    waterfall.start(false, 3000, .2, false);
    return waterfall;
}


function createFire(x, y, width, maxParticles) {
    var fire = game.add.emitter(x, y, 400);
    fire.width = width;
    fire.makeParticles('fire', [0, 1, 2]);
    fire.gravity.y = -20;

    fire.minParticleScale = 0.75;
    fire.maxParticleScale = 1.5;

    fire.setXSpeed(0, 0);  
    fire.setYSpeed(-100, -50);
    fire.start(false, 500, 0, false);
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
          if (fairyOnFire) {
            fairyFire.x = fairy.body.x+32;
            fairyFire.y = fairy.body.y+16;
          }
        // prevFairyDir = 'fairyLeft'; 
    } else {
        // player.body.velocity.x = 150;
        fairy.animations.play('fairyRight');
        if (fairyOnFire) {
            fairyFire.x = fairy.body.x+4;
            fairyFire.y = fairy.body.y+16;
        }
        // prevFairyDir = 'right';
    }
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
        } else if(dustSize>15) {
            // do nothing
        } else if(x != fairyPrevX || y != fairyPrevY) {

            bmd.ctx.lineTo(x, y);
           
            dist = dist + Math.abs(x - fairyPrevX) + Math.abs(y - fairyPrevY);
            
            fairyPrevX = x;
            fairyPrevY = y;
             
            if (dist >= 8){

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


function fairyFlammableCollision(fairy) {
    flammable.getAt(0).visible = false;
    var burningTree = flammable.create(4*32, 2*32, 'treeonfire');
    burningTree.body.immovable = true;
    timeCheck = game.time.now;
}

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
    if(!player.body.touching.down) {
        player.body.velocity.x = 0;
        player.body.velocity.y += 10;
    } else {
        player.body.velocity.y=0;
    }
}


function fairyWaterCollision(fairy, waterfall) {
    if(fairyOnFire) {
        fairyOnFire = false;
        fairyFire.destroy();
    }   
}


function playerLeverCollision() {
    lever.destroy(true, true);
    lever = game.add.sprite(32, 11*32, 'leverOn');
    game.physics.arcade.enable(lever);
    lever.body.immovable = true;
    leverOn = true;
}

function fallingblockPlatformCollision() {
    fallingBlock.body.immovable = true;
    fallingBlock.enableBody = true; 
    platforms.add(fallingBlock);
}


function fireWaterCollision(waterfall, fireBox) {
    // waterFireCount++;

    // if(waterFireCount > 20) {
    //     fires.destroy();
    //     fireBox.destroy();
    // }
    waterFireCount++;
    if(waterFireCount > 400){
        if (fireBox == fireBoxLeft) {
            fires.getAt(0).destroy(true, true);
            // var fire = fires.getAt(0);
            // fire.destroy(true, true);
        } else {
            fires.getAt(1).destroy(true, true);
            // var fire = fires.getAt(1);
            // fire.destroy(true, true);
        }
        
        waterFireCount = 0;
        fireBox.destroy(true, false);
    }
    // fireBox.destroy();
    // fireBox.kill();
}

function fairyFireCollision() {
    if(!fairyOnFire) {
        fairyOnFire = true;
        // Set fairy on fire
        fairyFire = game.add.emitter(fairy.body.x, fairy.body.y, 100);
        fairyFire.width = 5;
        fairyFire.makeParticles('fire', [0, 1, 2]);
        fairyFire.gravity = 100;

        fairyFire.minParticleScale = 0.75;
        fairyFire.maxParticleScale = 1.5;

        fairyFire.setXSpeed(-50, 50);  
        fairyFire.setYSpeed(-50, 50);
        fairyFire.start(false, 1000, 1, false);
    }
}

function waterLineCollision(invisibleBody, waterfall){
    waterfall.body.velocity.y = -20;
    if(waterfall.x - invisibleBody.x < 16) {
        waterfall.body.velocity.x = -100;
    } else {
        waterfall.body.velocity.x = 100;
    }
    waterfall.gravity = 200;
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



