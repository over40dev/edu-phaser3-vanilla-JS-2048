class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    this.load.image('emptytile', 'app/assets/sprites/emptytile.png');
    this.load.spritesheet('tiles', 'app/assets/sprites/tiles.png', {
      frameWidth: gameOptions.tiles.tileSize,
      frameHeight: gameOptions.tiles.tileSize,
    });
  }

  create() {
    this.scene.start('PlayGame');
  }
}
