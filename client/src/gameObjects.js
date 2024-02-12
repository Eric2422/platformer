/**
 * Super class for static sprites(e.g. obstacles)
 */
class CustomImage extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // add it to the game
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
}

/**
 * A super class for animated sprites(e.g. the player)
 */
class CustomSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteSheet) {
        super(scene, x, y, spriteSheet);

        // add it to the game
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
}

/**
 * Creates obstacles such as rocks
 */
class Obstacle extends CustomImage {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // Obstacles can't move or fall
        this.setPushable(false);
        this.setMaxVelocity(0, 0);
    }
}


/**
 * Represents the player
 */
class Player extends CustomSprite {
    constructor(scene, spawnPoint, config) {
        super(scene, 100, 100, config.sprite);

        // the x and y coordinates that the player spawns at
        this.spawnPoint = spawnPoint;

        // the velocity that the player jumps with
        this.jumpVelocity = config.jumpVelocity;

        // the player's acceleration
        this.walkAcceleration = config.walkAcceleration;

        // the player's max horizontal velocity is limited
        // vertical is not
        this.setMaxVelocity(config.walkSpeed, Infinity);

        // the player cannot exceed world boundaries
        this.setCollideWorldBounds(true, 0, 0);

        // By default, Phaser uses a default linear deceleration
        // Make player use a multiplicative deceleration
        this.setDamping(true);

        // player loses 95% of its speed each update
        this.setDrag(0.05);
    }
}

export { Obstacle, Player }