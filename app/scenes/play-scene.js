/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  boardArray = [];

  constructor() {
    super('PlayGame');
  }

  create() {
    const { rows, cols } = gameOptions.board;
    for (let row = 0; row < cols; row++) {
      this.boardArray[row] = [];
      for (let col = 0; col < rows; col++) {
        const { x, y } = this._position(row, col);
        this.add.image(x, y, 'emptytile');
        const tile = this.add.sprite(x, y, 'tiles', 0);
        tile.visible = false;
        this.boardArray[row][col] = {
          tileValue: COVER_TILE_VAL,
          tileSprite: tile,
        };
      }
    }
    this._addTile();
    this._addTile();
  }

  _addTile() {
    const emptyTiles = [];
    const { cols, rows } = gameOptions.board;

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < rows; col++) {
        if (this.boardArray[row][col].tileValue === 0) {
          emptyTiles.push({row, col});
        }
      }
    }
    if (emptyTiles.length > 0) {
      const {row, col} = cxRandom(emptyTiles);
      this.boardArray[row][col].tileValue = 1;
      this.boardArray[row][col].tileSprite.visible = true;
      this.boardArray[row][col].tileSprite.setFrame(0);
    }
  }

  _position(row, col) {
    const { tileSize, tileSpacing } = gameOptions.tiles;
    const pos = cxGeomPoint(
      (row + 1) * tileSpacing + (row + .5) * tileSize,
      (col + 1) * tileSpacing + (col + .5) * tileSize,
    );
    return pos;
  }
}
