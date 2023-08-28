class CustomImage extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // add it to the game
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
}


class Obstacle extends CustomImage {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // Obstacles can't move or fall
        this.setPushable(false);
        this.setMaxVelocity(0, 0);
    }
}


class Player extends CustomImage {
    constructor(scene, spawnPoint, config) {
        super(scene, 100, 100, config.sprite);

        // the x and y coordinates that the player spawns at
        this.spawnPoint = spawnPoint;

        // the velocity that the player jumps with
        this.jumpVelocity = config.jumpVelocity;

        // the player's acceleration
        this.xAcceleration = config.xAcceleration;

        // the player's max velocity
        // horizontal velocity is limited
        // vertical is not
        this.setMaxVelocity(config.maxXSpeed, Infinity);

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