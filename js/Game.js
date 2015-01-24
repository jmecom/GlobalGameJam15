var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var player;
var platforms;


//Variables for line drawing
var line = null;
var lineSprite = null;
var lineGraphic = null;
var mouseWasDown = false;
var linePath = null;
var linePathIndex = -1;
var linePathSpriteIndex = -1;


function preload() {
	game.load.image('sky', 'assets/images/sky.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
}
 

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); 

    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    // This stops it from falling away when you jump on it
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    // Set up the line
    line = game.add.group();
    line.enableBody = true;
    lineGraphic = game.add.graphics(0, 0);
    // blackoutGraphic();
    lineSprite = game.add.sprite(100, 100, 'star');
    lineSprite.anchor.setTo(0.5, 0.5);
    lineGraphic.lineStyle(4, 0xFF0000, 1); 
    game.physics.enable(lineSprite, Phaser.Physics.ARCADE);

    // graphic = game.add.graphics(0, 0);
    // blackoutGraphic();
    // sprite = game.add.sprite(100, 100, 'star');
    // sprite.anchor.setTo(0.5, 0.5); 
    // game.physics.enable(sprite, Phaser.Physics.ARCADE);
    
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
    
    // Draw a line at current mouse location
    if (game.input.mousePointer.isDown) {
      if (!mouseWasDown) {
        lineGraphic.moveTo(game.input.x, game.input.y);
        // blackoutGraphic();   // fixme     
        // console.log(line);
        // line.destroy();
        
        lineGraphic.alpha = 0;
        line = game.add.group();
    	line.enableBody = true;
    	lineGraphic = game.add.graphics(0, 0);
    	lineGraphic.lineStyle(4, 0xFF0000, 1); 

        linePathIndex = 0;
        linePathSpriteIndex = 0;
        linePath = [];
        mouseWasDown = true;
      }

      if (linePathIndex == 0 || (linePath[linePathIndex - 1].x != game.input.x || linePath[linePathIndex - 1].y != game.input.y)) {
        lineGraphic.lineTo(game.input.x, game.input.y);
        linePath[linePathIndex] = new Phaser.Point(game.input.x, game.input.y);
        linePathIndex++;
      }

    } else {
      mouseWasDown = false;
    }

    if (linePath != null && linePath.length > 0 && linePathSpriteIndex < linePathIndex) {
      linePathSpriteIndex = Math.min(linePathSpriteIndex, linePath.length - 1);
      game.physics.arcade.moveToXY(lineSprite, linePath[linePathSpriteIndex].x, linePath[linePathSpriteIndex].y, 250);
      if (game.physics.arcade.distanceToXY(lineSprite, linePath[linePathSpriteIndex].x, linePath[linePathSpriteIndex].y) < 20) {
        linePathSpriteIndex++;
        if (linePathSpriteIndex >= linePathIndex) {
          lineSprite.body.velocity.setTo(0, 0);
        }
      }
    }     
}


function blackoutGraphic() {
    lineGraphic.beginFill(0x000000);
    lineGraphic.lineStyle(4, 0x000000, 1);
    lineGraphic.drawRect(0, 0, game.width, game.height);
    lineGraphic.endFill();
    lineGraphic.lineStyle(4, 0xFF0000, 1);
}

 // function blackoutGraphic() {
 //    graphic.beginFill(0x000000);
 //    graphic.lineStyle(4, 0x000000, 1);
 //    graphic.drawRect(0, 0, game.width, game.height);
 //    graphic.endFill();
 //    graphic.lineStyle(4, 0xFF0000, 1);
 //  }










