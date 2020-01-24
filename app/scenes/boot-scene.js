class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    const 
      { tileSize } = gameOptions;
    
    this.load.image('restart', 'app/assets/sprites/restart.png');
    this.load.image('scorepanel', 'app/assets/sprites/scorepanel.png');
    this.load.image('scorelabels', 'app/assets/sprites/scorelabels.png');
    this.load.image('logo', 'app/assets/sprites/logo.png');
    this.load.image('howtoplay', 'app/assets/sprites/howtoplay.png');
    this.load.image('gametitle', 'app/assets/sprites/gametitle.png');
    this.load.image('emptytile', 'app/assets/sprites/emptytile.png');
    this.load.spritesheet('tiles', 'app/assets/sprites/tiles.png', {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
    this.load.audio('move', ['app/assets/sounds/move.ogg', 'app/assets/sounds/move.mp3']);
    this.load.audio('grow', ['app/assets/sounds/grow.ogg', 'app/assets/sounds/grow.mp3']);
    this.load.bitmapFont('font', 'app/assets/fonts/font.png', 'app/assets/fonts/font.fnt');
  }

  create() {
    this.scene.start('PlayGame');
  }
}
