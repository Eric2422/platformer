class TestScene extends Phaser.Scene {
    preload() {
        this.load.setBaseURL('http://127.0.0.1:5500/');

        this.load.image('player', './sprites/player0.png');
        this.load.image('limestone_wall', './sprites/limestone_wall.png');
    }

    create() {
        // create the player
        this.player = this.physics.add.image(400, 0, 'player');
        // the player cannot exceed world boundaries
        this.player.setCollideWorldBounds(true, 0, 0);

        // create listeners for the WASD keys
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // create a block of limestone
        this.limestone_block = this.physics.add.image(400, 250, 'limestone_wall');

        // other objects cannot move it
        this.limestone_block.setImmovable(true);

        // limestone is unaffected by gravity
        this.limestone_block.body.setAllowGravity(false);

        // set the border of the world
        this.physics.world.setBounds(0, 0, config.width, config.height);

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.limestone_block);
    }

    update() {
        // moves based on the keys pressed
        // opposing keys are mutually exclusive
        // but one x key and one y key is valid
        if (this.keyW.isDown) {
            this.player.y -= 5;;

        } else if (this.keyS.isDown) {
            this.player.y += 5;;
        } 
        
        if (this.keyA.isDown) {
            this.player.x -= 5;;

        } else if (this.keyD.isDown) {
            this.player.x += 5;;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        // arcade is a basic, fast physics engine
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scale: {
        // fit to window while maintaining ratio
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: TestScene
};

const game = new Phaser.Game(config);
console.log(game);