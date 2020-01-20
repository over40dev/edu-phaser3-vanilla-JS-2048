window.onload = function () {
  const
    { cols, rows, tileSpacing, tileSize } = gameOptions,
    gameConfig = {
      width: cols * (tileSize + tileSpacing) + tileSpacing,
      height: rows * (tileSize + tileSpacing) + tileSpacing,
      backgroundColor: 0xecf0f1,
      scene: [BootGame, PlayGame]
    };

  game = new Phaser.Game(gameConfig);
  
  window.focus();
  CX.resize();
  window.addEventListener("resize", CX.resize);
}
