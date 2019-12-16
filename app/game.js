var game;
const gameConfig = {
  width: 480,
  height: 640,
  backgroundColor: '0xff0000',
  scene: [BootGame, PlayGame],
};

window.onload = function () {
  game = new Phaser.Game(this.gameConfig);
  window.focus();
  this.resizeGame();
  window.addEventListener('resize', this.resizeGame)
}
