window.onload = function () {
  const { cols, rows } = gameOptions.board;
  const { tileSpacing, tileSize } = gameOptions.tiles;
  const gameConfig = {
    width: cols * (tileSize + tileSpacing) + tileSpacing,
    height: rows * (tileSize + tileSpacing) + tileSpacing,
    backgroundColor: 0xecf0f1,
    scene: [BootGame, PlayGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
}
