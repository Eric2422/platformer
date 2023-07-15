import { Graphics } from './graphics.js';

class Entity {
  static obsArray = [];

  constructor(vals) {
    this.sprite = new Image();
    this.sprite.src = vals.spriteFilePath;

    // scale everything to the screen size
    this.x = vals.x * Graphics.scale;

    this.width = this.sprite.width * Graphics.scale;
    this.centerX = this.x + this.width / 2;

    this.y = vals.y * Graphics.scale;
    this.height = this.sprite.height * Graphics.scale;
    this.centerY = this.y + this.height / 2;
  }

  // redraws Entity object
  draw() {
    // draw the corresponding sprite in the right location
    Graphics.ctx.drawImage(this.sprite, this.x, this.y);
  }

  // returns whether this collided with obs
  collidesWith(obs) {
    //
    // if this hits obs from the bottom
    // return 'bottom'
    // if this hits obs from top,
    // return 'top'
    // if this hits obs from left,
    // return 'left'
    // if this hits obs from right,
    // return 'right'
    // if this is not touching obstacle,
    // return false
    let distance = {
      x: this.centerX - obs.centerX,
      y: this.centerY - obs.centerY,
    };
    let collisionDist = {
      x: (this.width + obs.width) / 2,
      y: (this.height + obs.height) / 2,
    };

    let collision = false;
    // if the two object are in collision with each other
    if (
      Math.abs(distance['x']) <= collisionDist['x'] &&
      Math.abs(distance['y']) <= collisionDist['y']
    ) {
      //top and bottom
      // if this is colliding with obs more vertically than horizontally
      if (
        Math.abs(distance['x']) / collisionDist['x'] <=
        Math.abs(distance['y']) / collisionDist['y']
      ) {
        // top and bottom
        // hitting obs from top
        if (distance['y'] < 0) {
          collision = 'top';

          //hitting obs from bottom
        } else if (distance['y'] > 0) {
          // hitting obs from bottom
          collision = 'bottom';
        }

        // if this is colliding with obs more horizontally than vertically
      } else if (
        Math.abs(distance['y']) / collisionDist['y'] <=
        Math.abs(distance['x']) / collisionDist['x']
      ) {
        //left and right
        // hitting obs from left
        if (distance['x'] < 0) {
          collision = 'left';

          //hitting obs from right
        } else if (distance['x'] > 0) {
          // hitting obs from righ
          collision = 'right';
        }
      }
    }

    return collision;
  }
}

// creates doors
class Door extends Entity { }

// creates obstacles
class Obstacle extends Entity {
  constructor(vals) {
    super(vals);
    this.friction = vals.friction;
    Entity.obstaclesArray.push(this);
  }
}

// a class for creating player object
class Player extends Entity {
  constructor(vals) {
    super(vals);

    this.xVelocity = 0;
    // the player's xAcceleration
    this.xAcceleration = vals.xAcceleration * Graphics.scale;
    // the direction the player is moving in
    // 1 is right
    // -1 is left
    this.xDirection = 0;
    this.maxXSpeed = vals.maxXSpeed * Graphics.scale;

    this.yVelocity = 0;
    this.jumpVelocity = -6.7 * Graphics.scale;
    this.falling = false;
    // the player is sliding down a wall
    this.wallSliding = false;
    // the down button i spressed
    this.downPressed = false;

    this.animationState = 0;
  }

  // change player sprite
  updateSprite() {
    // increments animationState
    this.animationState++;
    // loop animation state to fit the number of sprites
    this.animationState %= 2;
  }
}

export { Entity, Door, Player, Obstacle };
