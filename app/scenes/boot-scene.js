class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    const 
      { tileSize } = gameOptions;

    this.load.image('emptytile', 'app/assets/sprites/emptytile.png');
    this.load.spritesheet('tiles', 'app/assets/sprites/tiles.png', {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
    this.load.audio('move', ['app/assets/sounds/move.ogg', 'app/assets/sounds/move.mp3']);
    this.load.audio('grow', ['app/assets/sounds/grow.ogg', 'app/assets/sounds/grow.mp3']);
  }

  create() {
    this.scene.start('PlayGame');
  }
}
