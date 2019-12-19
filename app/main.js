window.onload = function() {
  game = new Phaser.Game(game4096.config);
  console.log(game4096);
  window.focus();
  window.resizeGame();
  window.addEventListener(
    'resize', 
    resizeGame);
}
