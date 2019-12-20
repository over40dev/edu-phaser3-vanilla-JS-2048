var game;
var gameConfig = {
  width: gameOptions.board.cols * (),
  height: gameOptions.board.rows ,
  backgroundColor: 0xecf0f1,
  scene: [BootGame, PlayGame],
};

window.onload = function() {
  game = new Phaser.Game(gameOptions.config);
  window.focus();
  window.resizeGame();
  window.addEventListener(
    'resize', 
    resizeGame);
}
