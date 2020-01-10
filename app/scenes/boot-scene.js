class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    const {tileSize} = gameOptions.tiles;
    this.load.image('emptytile', 'app/assets/sprites/emptytile.png');
    this.load.spritesheet('tiles', 'app/assets/sprites/tiles.png', {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
  }

  create() {
    this.scene.start('PlayGame');
  }
}
