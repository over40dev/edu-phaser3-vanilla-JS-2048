
// play-game.js
class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    const {rows, cols} = gameOptions.board;
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        const {x, y} = this.getTilePosition(row, col);
        this.add.image(x, y, "emptytile");
        this.add.sprite(x, y, "tiles", 0);
      }
    }
  }
  getTilePosition(row, col) {
    const {tileSize, tileSpacing} = gameOptions.tiles;
    var posX = tileSpacing * (col + 1) + tileSize * (col + 0.5);
    var posY = tileSpacing * (row + 1) + tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }
}
function resizeGame() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
