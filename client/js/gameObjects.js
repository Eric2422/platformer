class Platform extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // add it to the game
        scene.physics.add.existing(this);
        scene.add.existing(this);

        // platforms can't move or fall
        this.setImmovable(true);
        this.body.setAllowGravity(false);
    }
}

class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        // add it to the game
        scene.physics.add.existing(this);
        scene.add.existing(this);

        // the player cannot exceed world boundaries
        this.player.setCollideWorldBounds(true, 0, 0);

        // By default, Phaser uses a default linear deceleration
        // Make player use a multiplicative deceleration
        this.player.setDamping(true);

        // player loses 95% of its speed each update
        this.player.body.setDrag(0.05, 0);
    }
}

export { Platform }