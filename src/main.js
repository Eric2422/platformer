import { Entity, Door, Player, Obstacle } from './entities.js';
import { Graphics } from './graphics.js';

// code that starts and ticks the game
class System {
  // bind the control keys
  static bindKeys() {
    document.addEventListener('keydown', function (event) {
      switch (event.key.toLowerCase()) {
        // jump
        case 'arrowup':
        case ' ':
        case 'w':
          if (!Entity.player.falling) {
            Entity.player.yVelocity = Entity.player.jumpVelocity;
          }
          break;

        // slide down walls faster
        case 'arrowdown':
        case 's':
          if (Entity.player.wallSliding) {
            Entity.player.downPressed = true;
          }
          break;

        // move left
        case 'arrowleft':
        case 'a':
          // 1 is right
          // -1 is left
          Entity.player.xDirection = -1;
          break;

        // move right
        case 'arrowright':
        case 'd':
          // 1 is right
          // -1 is left
          Entity.player.xDirection = 1;
          break;
      }
    });

    // when the player releases a button
    document.addEventListener('keyup', function (event) {
      switch (event.key.toLowerCase()) {
        // when the player releases a horizontal button, stop accelerating
        case 'a':
        case 'd':
        case 'arrowleft':
        case 'arrowright':
          Entity.player.xDirection = 0;
          break;

        // stop sliding faster
        case 's':
        case 'arrowdown':
          Entity.player.downPressed = false;
      }
    });
  }

  //starts game
  static start() {
    // makes the canvas cover the entire screen
    Graphics.canvas.width = screen.width;
    Graphics.canvas.height = screen.height;

    this.lvl = 1;

    // bind the controls
    System.bindKeys();

    System.loadLvl(this.lvl);

    this.gravity = 0.25 * Graphics.scale;
    this.terminalVelocity = System.gravity ** -1.5;

    // start the interval that ticks the game
    this.gameTick = setInterval(this.tick, 20);
    Entity.player.updateSprite();
    this.animatePlayer = setInterval(Entity.player.updateSprite, 2000);
  }

  // Accepts lvl, which specifies which level file needs to be accessed.
  // Then sets up the level
  static loadLvl(lvl) {
    // gets information from file about the map
    // and stores information for each object in an array
    const lvlMap = Files.readFile(`./jsons/lvls/${lvl}.json`);
    const playerData = Files.readFile('./jsons/player.json');

    // clears the game of old platforms
    Entity.obstaclesArray = [];

    // creates the obstacles
    for (let obstacle of lvlMap.obstacles) {
      new Obstacle(obstacle);
    }

    // set the player's x and y to the coordinates specified in the lvlMap
    playerData.x = lvlMap.playerSpawnPoint[0];
    playerData.y = lvlMap.playerSpawnPoint[1];

    // creates player
    Entity.player = new Player(playerData);

    console.log(Entity.player);

    // set the player's spawn point
    Entity.player.spawnPoint = lvlMap.playerSpawnPoint;

    // save the background into the Graphics class
    Graphics.background = lvlMap.background;

    // creates door
    Entity.door = new Door(lvlMap.door);
  }

  // move the player according to their speed
  static movePlayer() {
    // Change player position
    // if player is falling and below terminal velocity,
    // increase their fall speed
    if (Entity.player.falling && Entity.player.yVelocity < System.terminalVelocity) {
      Entity.player.yVelocity += System.gravity;
      // if player is sliding on wall without pressing down
      if (Entity.player.wallSliding && !Entity.player.downPressed) {
        // slow them down
        Entity.player.yVelocity *= 0.8;
      }
    }

    // change player y
    Entity.player.y += Entity.player.yVelocity;

    // increase player speed using xAcceleration
    Entity.player.xVelocity += Entity.player.xDirection * Entity.player.xAcceleration;

    // if the player is going above maxXSpeed,
    // slow them down
    if (Entity.player.xVelocity > Entity.player.maxXSpeed) {
      Entity.player.xVelocity = Entity.player.maxXSpeed;
    } else if (Entity.player.xVelocity < -Entity.player.maxXSpeed) {
      Entity.player.xVelocity = -Entity.player.maxXSpeed;
    }

    // change player x
    Entity.player.x += Entity.player.xVelocity;

    Entity.player.centerX = Entity.player.x + Entity.player.width / 2;
    Entity.player.centerY = Entity.player.y + Entity.player.height / 2;
  }

  // check for player collision with obstacles
  static checkObstacleCollision() {
    // Check if player collides with obstacles.
    // If it does so from the top,
    // player stops falling.

    // colllisionArray is to prvent the multiple collision checks from overriding each other
    // and creating odd effects
    let collisionArray = [];

    // draws and checks for collision of each obstacle
    for (let obstacle of Entity.obstaclesArray) {
      obstacle.draw();
      let collision = Entity.player.collidesWith(obstacle);

      collisionArray.push(collision);
    }

    // if player hit top of any obstacle
    if (collisionArray.includes('top')) {
      // prevent the player from clpping into the obstacle
      Entity.player.y =
        Entity.obstaclesArray[collisionArray.indexOf('top')].y - Entity.player.height;
      Entity.player.yVelocity = 0;
      Entity.player.falling = false;
      // slows down player based on obstacles friction value
      Entity.player.xVelocity *=
        1 - Entity.obstaclesArray[collisionArray.indexOf('top')].friction;
    }

    // if player hit left of any obstacle
    if (collisionArray.includes('left')) {
      // prevent the player from clpping into the obstacle
      Entity.player.x =
        Entity.obstaclesArray[collisionArray.indexOf('left')].x - Entity.player.width;
      Entity.player.xVelocity = 0;
      Entity.player.falling = true;
      // the player is slidng on a wall
      Entity.player.wallSliding = true;
    }

    // if player hit right of any obstacle
    if (collisionArray.includes('right')) {
      // prevent the player from clpping into the obstacle
      Entity.player.x =
        Entity.obstaclesArray[collisionArray.indexOf('right')].x +
        Entity.obstaclesArray[collisionArray.indexOf('right')].width;
      Entity.player.xVelocity = 0;
      Entity.player.falling = true;
      // the player is slidng on a wall
      Entity.player.wallSliding = true;
    }

    // if player hit bottom of any obstacle
    if (collisionArray.includes('bottom')) {
      // prevent the player from clpping into the obstacle
      Entity.player.y =
        Entity.obstaclesArray[collisionArray.indexOf('bottom')].y +
        Entity.obstaclesArray[collisionArray.indexOf('bottom')].height;
      Entity.player.yVelocity = 0;
      //apply friction
      Entity.player.xVelocity *=
        1 - Entity.obstaclesArray[collisionArray.indexOf('bottom')].friction;
    }

    // if player hits no obstacles
    // if every element in collisionArray is false,
    // the player is falling and not wallSliding
    if (
      collisionArray.every((ele) => {
        return ele === false;
      })
    ) {
      Entity.player.falling = true;
      Entity.player.wallSliding = false;
    }
  }

  static tick() {
    //Clears the screen
    Graphics.ctx.clearRect(0, 0, screen.width, screen.height);

    // move the player based on their velocity
    System.movePlayer();

    // check for player collision and apply movement rules(e.g. falling and friction)
    System.checkObstacleCollision();

    // Re-draws player in new location
    Entity.player.draw();

    // re-draw the background
    // if the background is an array of tiles
    if (typeof Graphics.background == 'object') {
      // lay out the background
      // the coordinates of the top-left corner
      let tileX = 0;
      let tileY = 0;

      for (let row of Graphics.background) {
        let img;
        for (let col of row) {
          // create new HTML image element
          img = new Image();
          // set the src of the img to the file in lvlMap
          img.src = col;
          //draw the tile
          Graphics.ctx.drawImage(img, tileX, tileY, img.width * Graphics.scale, img.height * Graphics.scale);

          // move the x position for the next tile
          tileX += img.width * Graphics.scale;
        }
        // move the y position for the next row
        tileX += img.height * Graphics.scale;
      }
    } else {
      // create new HTML image element
      let img = new Image();
      // set the src of the img to the file in lvlMap
      img.src = Graphics.background;
      //draw the tile
      Graphics.ctx.drawImage(img, 0, 0, img.width * Graphics.scale, img.height * Graphics.scale);
    }

    //Draws door
    Entity.door.draw();

    // If player collides with the level's door,
    // send them to the next level
    if (Entity.player.collidesWith(Entity.door)) {
      System.lvl += 1;
      System.loadLvl(System.lvl);
    }

    // if player fell out of the world
    // respawn them
    if (Entity.player.y > Graphics.canvas.height) {
      // set the player's x and y back to spawn
      Entity.player.x = Entity.player.spawnPoint[0];
      Entity.player.y = Entity.player.spawnPoint[1];

      // clear both x and y velocity
      [Entity.player.xVelocity, Entity.player.yVelocity] = [0, 0];
    }
  }
}

// file reading
class Files {
  static readFile(filePath) {
    // location returns the URL
    // protocal specifies whether it is HTTPS, HTTP, file, etc.
    if (location.protocol === 'file:') {
    } else {
      let req = new XMLHttpRequest();

      // opens new request
      // parameters: method, file location, async
      req.open('GET', filePath, false);

      // sends request to server
      req.send();

      // if request returns 200(OK),
      // file equals the returned text from server
      let file;

      if (req.status == 200) {
        file = req.responseText;
      } else {
        console.log('The file could not be accessed');
      }

      return JSON.parse(file);
    }
  }
}

System.start();