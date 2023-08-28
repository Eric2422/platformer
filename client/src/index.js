import { Level, SceneLoader } from './scenes.js';

console.log(`width: ${window.screen.availWidth}`);
console.log(`height: ${window.screen.availHeight}`);

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }
        }
    },
    scale: {
        // fit to window while maintaining ratio
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [SceneLoader, Level]
};

const game = new Phaser.Game(config);