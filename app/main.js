window.onload = onDeviceReady;
document.addEventListener('deviceready', onDeviceReady);

function onDeviceReady() {
  const
    { cols, tileSpacing, tileSize, aspectRatio } = gameOptions,
    width = cols * (tileSize + tileSpacing) + tileSpacing,
    gameConfig = { // based on Portrait layout
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game4096',
        width: width,
        height: width * aspectRatio,
      },
      backgroundColor: 0x000000,
      scene: [BootGame, PlayGame],
      type: Phaser.AUTO,
    };

  game = new Phaser.Game(gameConfig);
  
  window.focus();
}
