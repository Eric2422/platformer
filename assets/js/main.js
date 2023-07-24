class TestScene extends Phaser.Scene {
    preload() {
        this.load.setBaseURL('http://127.0.0.1:5500/');

        this.load.image('player', './assets/png/player0.png');
        this.load.image('limestone_wall', './assets/png/limestone_wall.png');

        // create listeners for the WASD keys
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // set the border of the world
        this.physics.world.setBounds(0, 0, config.width, config.height);
    }

    create() {
        // create the player
        this.player = this.physics.add.image(400, 0, 'player');

        // the player cannot exceed world boundaries
        this.player.setCollideWorldBounds(true, 0, 0);

        // By default, Phaser uses a default linear deceleration
        // Make player use a multiplicative deceleration
        this.player.setDamping(true);

        // slow down the player 
        this.player.body.setDrag(0.1, 0);

        // create 16 limestone blocks
        this.obstacles = [];

        for (let i = 0; i < 16; i++) {
            // create a block of limestone
            this.obstacles.push(this.physics.add.image(400 + (i * 64), 250 - (i * 0), 'limestone_wall'));

            // other objects cannot move it
            this.obstacles[i].setImmovable(true);

            // limestone is unaffected by gravity
            this.obstacles[i].body.setAllowGravity(false);

            this.obstacles[i].body.setDrag(200, 0);
        }

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.obstacles);
    }

    update() {
        // moves based on the keys pressed
        // opposing keys are mutually exclusive
        // but one x key and one y key is valid

        // if w is pressed and the player is on something,
        // jump
        if (this.keyW.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y -= 200;

        } else if (this.keyS.isDown) {
            this.player.body.velocity.y += 10;
        }

        if (this.keyA.isDown) {
            this.player.body.velocity.x -= 10;

        } else if (this.keyD.isDown) {
            this.player.body.velocity.x += 10;
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