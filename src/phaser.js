class TestScene extends Phaser.Scene {
    preload () {
        this.load.setBaseURL('http://127.0.0.1:5500/platformer');

        this.load.image('player', './sprites/player0.png');
        this.load.image('limestone_wall', './sprites/limestone_wall.png');
    }

    create() {
        // create the player
        this.player = this.physics.add.image(400, 0, 'player');

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

        this.physics.world.setBounds(0, 0, config.width, config.height);

        this.player.setCollideWorldBounds(true);

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.limestone_block);
    }

    update() {
        if (this.keyW.isDown) {
            this.player.y -= 50;

         } else if(this.keyA.isDown) {
            this.player.x = (-50);

         } else if(this.keyS.isDown) {
            this.player.setVelocityY(50);

         } else if(this.keyD.isDown) {
            this.player.setVelocityX(50);
         }

    }
}

const config = {
    type: Phaser.AUTO,
    width: window.screen.width,
    height: window.screen.height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: TestScene
};

const game = new Phaser.Game(config);