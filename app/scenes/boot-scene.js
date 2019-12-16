class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  create() {
    console.log('boot-game');
    this.scene.start('PlayGame');
  }
}
