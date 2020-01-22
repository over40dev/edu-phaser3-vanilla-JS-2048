window.onload = function () {
  const
    { cols, tileSpacing, tileSize, aspectRatio } = gameOptions,
    width = cols * (tileSize + tileSpacing) + tileSpacing,
    gameConfig = { // based on Portrait layout
      width: width,
      height: width * aspectRatio,
      backgroundColor: 0x000000,
      scene: [BootGame, PlayGame],
    };

  game = new Phaser.Game(gameConfig);
  
  window.focus();
  CX.resize();
  window.addEventListener("resize", CX.resize);
}
