import { Obstacle, Player } from './gameObjects.js';

class Area extends Phaser.Scene {
    constructor() {
        super({ key: 'area' });
    }

    // init can run to replay the scene without creating a new object
    // prepare the data
    init(data) {
        this.areaURL = data.areaURL;

        this.playerURL = data.playerURL;
    }

    /**
     * Loads the Player data
     */
    loadPlayerData() {
        // load the player file
        this.load.json(this.playerURL, this.playerURL);
    }

    // load the necessary assets
    preload() {
        // load the JSONs   
        this.load.setBaseURL('./assets/json/');

        // load the area file
        this.load.json(this.areaURL, this.areaURL);

        // when the area file is loaded
        this.load.on(`filecomplete-json-${this.areaURL}`, () => {
            this.loadPlayerData();

            // once the player JSON is loaded
            this.load.on(`filecomplete-json-${this.playerURL}`, () => {
                // get the area data
                this.areaData = this.cache.json.get(this.areaURL);

                // get the player data
                this.playerData = this.cache.json.get(this.playerURL);

                // load the images
                this.load.setBaseURL('./assets/sprites/');

                // create a non-repeating list of sprites to load
                const sprites = [];

                // add player sprite to sprites
                sprites.push(this.playerData.sprite);

                // add the background image to sprites
                sprites.push(this.areaData.background);

                // add the sprite for each obstacle to sprites
                this.areaData.obstacles.forEach(
                    ele => {
                        if (!sprites.includes(ele.sprite)) {
                            sprites.push(ele.sprite);
                        }
                    }
                );

                // load each sprite
                sprites.forEach(
                    ele => {
                        this.load.image(ele, ele)
                    }
                );
            });
        });
    }

    // add elements to game
    create() {
        // create listeners for the WASD keys
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // add the background
        this.add.image(
            this.sys.game.canvas.width / 2,
            this.sys.game.canvas.height / 2,
            this.areaData.background
        );

        // create the player
        this.player = new Player(
            this,
            this.areaData.playerSpawnPoint,
            this.playerData
        );

        // array to track the obstacles
        this.obstacles = [];

        // create each obstacle in the json
        for (let obstacle of this.areaData.obstacles) {
            this.obstacles.push(
                new Obstacle(
                    this,
                    obstacle.x,
                    obstacle.y,
                    obstacle.sprite
                )
            );
        }

        // collider automatically stops them from passing through each other
        this.physics.add.collider(this.player, this.obstacles);
    }

    // updates the game
    update() {
        // moves based on the keys pressed
        // opposing keys are mutually exclusive,
        // but one x key and one y key is valid

        // if w is pressed and the player is on something,
        // jump
        if (this.keySpace.isDown && this.player.body.onFloor()) {
            this.player.body.velocity.y -= this.player.jumpVelocity;

        }

        // move right
        if (this.keyA.isDown) {
            this.player.body.velocity.x -= this.player.walkAcceleration;

            // move right
        } else if (this.keyD.isDown) {
            this.player.body.velocity.x += this.player.walkAcceleration;
        }
    }
}

class SceneLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'sceneLoader' });
    }

    create() {
        let data = {
            areaURL: 'areas/coastalCliff.json',
            playerURL: 'player.json'
        }

        this.scene.start('area', data);
    }
}

export { Area, SceneLoader }