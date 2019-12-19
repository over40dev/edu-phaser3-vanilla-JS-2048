class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    this.load.image('emptytile', 'app/assets/sprites/emptytile.png');
  }

  create() {
    this.scene.start('PlayGame');
  }
}
