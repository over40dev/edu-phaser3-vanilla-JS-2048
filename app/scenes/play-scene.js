/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  boardArray = [];
  emptyTiles = [];

  constructor() {
    super('PlayGame');
  }
  create() {
    const { rows, cols } = gameOptions.board;
    for (let col = 0; col < cols; col++) {
      this.boardArray[col] = [];
      for (let row = 0; row < rows; row++) {
        const { x, y } = this._position(col, row);
        console.log(x,y);
        this.add.image(x, y, 'emptytile');
        const tile = this.add.sprite(x, y, 'tiles', 0);
        tile.visible = true;
        this.boardArray[col][row] = {
          tileValue: 0,
          tileSprite: tile,
        }
      }
    }
    this._addTile();
    this._addTile();
  }

  _addTile() {
    const { cols, rows } = gameOptions.board;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (this.boardArray[col][row].tileValue = 0) {
          this.emptyTiles.push({col,row});
        }
      }
    }
    if (this.emptyTiles.length > 0) {
      const chosenTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
      this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite = true;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
    }
  }

  _position(col, row) {
    const { tileSize, tileSpacing } = gameOptions.tiles;
    const pos = new Phaser.Geom.Point(
      (col + 1) * tileSpacing + (col + .5) * tileSize,
      (row + 1) * tileSpacing + (row + .5) * tileSize,
    );
    return pos;
  }
}
