class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame');
  }

  preload() {
    // absolute path???
    const 
      { tileSize } = gameOptions;
    
    this.load.image('fullscreen', 'assets/sprites/fullscreen.png');
    this.load.image('restart', 'assets/sprites/restart.png');
    this.load.image('scorepanel', 'assets/sprites/scorepanel.png');
    this.load.image('scorelabels', 'assets/sprites/scorelabels.png');
    this.load.image('logo', 'assets/sprites/logo.png');
    this.load.image('howtoplay', 'assets/sprites/howtoplay.png');
    this.load.image('gametitle', 'assets/sprites/gametitle.png');
    this.load.image('emptytile', 'assets/sprites/emptytile.png');
    this.load.spritesheet('tiles', 'assets/sprites/tiles.png', {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
    this.load.audio('move', ['assets/sounds/move.ogg', 'assets/sounds/move.mp3']);
    this.load.audio('grow', ['assets/sounds/grow.ogg', 'assets/sounds/grow.mp3']);
    this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
  }

  create() {
    this.scene.start('PlayGame');
  }
}
