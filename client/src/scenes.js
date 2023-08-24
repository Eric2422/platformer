import { Platform, Player } from './customGameObjects.js';

class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'level' });
    }

    // init can run to replay the scene without creating a new object
    // prepare the data
    init(data) {
        this.levelURL = data.levelURL;

        this.playerURL = data.playerURL;
    }

    // load the necessary assets
    preload() {
        // load the JSONs
        this.load.setBaseURL('./assets/json');
        this.load.json(this.levelURL, this.levelURL);
        this.load.json(this.playerURL, this.playerURL);

        // once all the JSONs are done loading
        this.load.on('complete',
            () => {

                // get the level data
                this.levelData = this.cache.json.get(this.levelURL, this.levelURL);

                // get the player data
                this.playerData = this.cache.json.get(this.playerURL, this.playerURL);

                // load the images
                this.load.setBaseURL('./assets/sprites');

                // create a non-repeating list of sprites to load
                const sprites = [];

                sprites.push(this.playerData.sprite);

                // load the sprite for each obstacle
                this.levelData.platforms.forEach(
                    ele => {
                        if (!sprites.includes(ele.sprite)) {
                            sprites.push(ele.sprite);
                        }
                    }
                );
                
                console.log(sprites);
                
                sprites.forEach(
                    ele => {
                        this.load.image(ele, ele)
                    }
                );
        });
    }

    // add elements to game
    create() {
        // create listeners for the WASD keys
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // create the player
        this.player = new Player(
            this,
            this.levelData.playerSpawnPoint,
            this.playerData
        );

        // array to track the platformers
        this.platforms = [];

        // create each obstacle in the json
        for (let platform of this.levelData.platforms) {
            this.platforms.push(
                new Platform(
                    this,
                    platform.x,
                    platform.y,
                    platform.sprite
                )
            )
        }

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.platforms);
    }

    // updates the game
    update() {
        // moves based on the keys pressed
        // opposing keys are mutually exclusive,
        // but one x key and one y key is valid

        // if w is pressed and the player is on something,
        // jump
        if (this.keySpace.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y -= this.player.jumpVelocity;

        }

        // move right
        if (this.keyA.isDown) {
            this.player.body.velocity.x -= this.player.xAcceleration;

            // move right
        } else if (this.keyD.isDown) {
            this.player.body.velocity.x += this.player.xAcceleration;
        }
    }
}

class SceneLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'sceneLoader' });
    }

    create() {
        let data = {
            levelURL: 'lvls/lvl0.json',
            playerURL: 'player.json'
        }

        this.scene.start('level', data);
    }
}

export { Level, SceneLoader }