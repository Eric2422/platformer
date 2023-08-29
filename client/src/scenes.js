import { Obstacle, Player } from './customGameObjects.js';

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
        this.load.setBaseURL('./assets/json/');

        // load the level file
        this.load.json(this.levelURL, this.levelURL);

        // when it's complete
        this.load.on(`filecomplete-json-${this.levelURL}`, () => {
            // load the player file
            this.load.json(this.playerURL, this.playerURL);

            // once both JSONs are loaded
            this.load.on(`filecomplete-json-${this.playerURL}`, () => {
                // get the level data
                this.levelData = this.cache.json.get(this.levelURL);
    
                // get the player data
                this.playerData = this.cache.json.get(this.playerURL);
    
                // load the images
                this.load.setBaseURL('./assets/sprites/');
    
                // create a non-repeating list of sprites to load
                const sprites = [];
    
                // add player sprite to sprites
                sprites.push(this.playerData.sprite);

                // add the background image to sprites
                sprites.push(this.levelData.background);
    
                // add the sprite for each obstacle to sprites
                this.levelData.obstacles.forEach(
                    ele => {
                        if (!sprites.includes(ele.sprite)) {
                            sprites.push(ele.sprite);
                        }
                    }
                ); 
                
                console.log(sprites);

                // load each sprite
                sprites.forEach(
                    ele => {
                        this.load.image(ele, ele)
                    }
                );
            });
        });

        console.log(this.textures);
    }

    // add elements to game
    create() {
        // create listeners for the WASD keys
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // add the background
        console.log(this.levelData.background);
        this.add.image(screen.availWidth / 2, screen.availHeight / 2, this.levelData.background);

        // create the player
        this.player = new Player(
            this,
            this.levelData.playerSpawnPoint,
            this.playerData
        );

        // array to track the obstacles
        this.obstacles = [];

        // create each obstacle in the json
        for (let obstacle of this.levelData.obstacles) {
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