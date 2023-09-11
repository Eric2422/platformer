import { CookieHandler } from './cookies.js';
import { Area, SceneLoader } from './scenes.js';

CookieHandler.setCoookie();
CookieHandler.logCookie();

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 }
        }
    },
    scale: {
        // fit to window while maintaining ratio
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [SceneLoader, Area]
};

const game = new Phaser.Game(config);