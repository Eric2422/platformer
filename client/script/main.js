import { Platform } from './gameObjects.js';
import { Files } from './files.js';

class Level extends Phaser.Scene {
    // pass in the parsed JSONs of the level and player
    constructor(levelJSON, playerJSON) {
        super();

        // an Array of the png's to load
        this.imageFilePaths = [];

        // add the player sprite to imageFilePaths
        this.imageFilePaths.push(playerJSON.sprite);

        // add the sprite for each obstacle
        levelJSON.obstacles.forEach(ele => this.imageFilePaths.push(ele.sprite));
    }

    preload() {
        this.load.setBaseURL('http://127.0.0.1:5500/sprites');

        this.imageFilePaths.forEach(ele => {
            console.log(`${ele}.png`);
            this.load.image(ele, `${ele}.png`);
        }
        );
    }

    init() {
        // create listeners for the WASD keys
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // set the border of the world
        this.physics.world.setBounds(0, 0, config.width, config.height);
    }

    create() {
        // create the player
        this.player = this.physics.add.image(400, 0, 'player');

        // create 16 limestone blocks
        this.limestone_blocks = [];
        for (let i = 0; i < 16; i++) {
            this.limestone_blocks.push(
                new Platform(
                    this,
                    400 + (i * 64),
                    250 - (i * 0),
                    'limestone'
                )
            );
        }

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.limestone_blocks);
    }

    update() {
        // moves based on the keys pressed
        // opposing keys are mutually exclusive
        // but one x key and one y key is valid

        // if w is pressed and the player is on something,
        // jump
        if (this.keySpace.isDown && this.player.body.velocity.y == 0) {
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

let newScene = new Level(
    await Files.readJSON('./json/lvls/0.json'),
    await Files.readJSON('./json/player.json')
);

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    },
    scale: {
        // fit to window while maintaining ratio
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: newScene
};

const game = new Phaser.Game(config);