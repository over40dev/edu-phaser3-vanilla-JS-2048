/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  boardArray = [];
  canMove = false;

  constructor() {
    super('PlayGame');
  }

  create() {
    this.canMove = false;
    const { rows, cols } = gameOptions.board;

    for (let row = 0; row < cols; row++) {
      this.boardArray[row] = [];
      for (let col = 0; col < rows; col++) {
        const { x, y } = this._getTilePosition(row, col);
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
    this.input.keyboard.on('keydown', this._handleKey, this);
    this.input.on('pointerup', this._handleSwipe, this);
  }

  _addTile() {
    const emptyTiles = [];
    const { cols, rows } = gameOptions.board;

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < rows; col++) {
        if (this.boardArray[row][col].tileValue === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } = cxRandom(emptyTiles);
      this.boardArray[row][col].tileValue = 1;
      this.boardArray[row][col].tileSprite.visible = true;
      this.boardArray[row][col].tileSprite.setFrame(0);
      this.boardArray[row][col].tileSprite.alpha = 0;
      this.tweens.add({
        targets: [this.boardArray[row][col].tileSprite],
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: () => { this.canMove = true },
      });
    }
  }

  _getTilePosition(row, col) {
    const { tileSize, tileSpacing } = gameOptions.tiles;
    return cxGeomPoint(
      (row + 1) * tileSpacing + (row + .5) * tileSize,
      (col + 1) * tileSpacing + (col + .5) * tileSize,
    );
  }

  _handleKey(e) {
    if (this.canMove) {
      // look for WASD and arrow keys to move using keyboard
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          this._makeMove(LEFT);
          break;
        case "ArrowRight":
        case "KeyD":
          this._makeMove(RIGHT);
          break;
        case "KeyW":
        case "ArrowUp":
          this._makeMove(UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this._makeMove(DOWN);
          break;

        default:
          break;
      }
    }
  }

  _handleSwipe(e) {
    if (this.canMove) {
      const {
        swipeMaxTime,
        swipeMinDist,
        swipeMinNormal,
      } = gameOptions;
      const swipeTime = e.upTime - e.downTime;
      const fastEnough = swipeTime < swipeMaxTime;
      const swipe = CX.getVectorPoint(e.upX - e.downX, e.upY - e.downY);
      const swipeMagnitude = CX.getMagnitude(swipe);
      const longEnough = swipeMagnitude > swipeMinDist;
      if (longEnough && fastEnough) {
        CX.setMagnitude(swipe, 1); // normalize vector to magnitude of 1
        if (swipe.x > swipeMinNormal) {
          this._makeMove(RIGHT);
        }
        if (swipe.x < -swipeMinNormal) {
          this._makeMove(LEFT);
        }
        if (swipe.y > swipeMinNormal) {
          this._makeMove(DOWN);
        }
        if (swipe.y < -swipeMinNormal) {
          this._makeMove(UP);
        }
      }
      // console.log('time: ', swipeTime);
      // console.log('H-dist: ', swipe.x);
      // console.log('V-dist: ', swipe.y);
      // console.log(
      //   swipeMaxTime,
      //   swipeMinDist,
      //   swipeMinNormal,
      // );
    }
  }

  /** TODO: makeMove impl v02 */
  _makeMove(d) {
    const dRow = (d === LEFT || d === RIGHT) ? 0 : d === UP ? -1 : 1;
    const dCol = (d === UP || d === DOWN) ? 0 : d === LEFT ? -1 : 1;

    this.canMove = false;
    let movedTiles = 0;
    const { rows, cols } = gameOptions.board;
    const _firstRow = (d === UP) ? 1 : 0;
    const _lastRow = rows - ((d === DOWN) ? 1 : 0);
    const _firstCol = (d === LEFT) ? 1 : 0;
    const _lastCol = cols - ((d === RIGHT) ? 1 : 0);
    for (let row = _firstRow; row < _lastRow; row++) {
      for (let col = _firstCol; col < _lastCol; col++) {
        const _curRow = dRow === 1 ? (_lastRow - 1) - row : row;
        const _curCol = dCol === 1 ? (_lastCol - 1) - col : col;
        const _curTile = this.boardArray[_curRow][_curCol];
        const _tileValue = _curTile.tileValue;
        if (_tileValue != 0) {
          let _newRow = _curRow;
          let _newCol = _curCol;
          while (this._isLegalPosition(_newRow + dRow, _newCol + dCol)) {
            _newRow += dRow;
            _newCol += dCol;
          }
          movedTiles++;
          _curTile.depth = movedTiles;
          const _newTile = this.boardArray[_newRow][_newCol];
          const _newPos = this._getTilePosition(_newRow, _newCol);
          _curTile.tileSprite.x = _newPos.x;
          _curTile.tileSprite.y = _newPos.y;
          _curTile.tileValue = 0;
          if (_newTile.tileValue === _tileValue) {
            _newTile.tileValue++;
            _curTile.tileSprite.setFrame(_tileValue)
          } else {
            _newTile.tileValue = _tileValue;
          }

        }
      }
    }
  }

  _isLegalPosition(r, c) {
    const { rows, cols } = gameOptions.board;
    const rowInside = r >= 0 && r < rows;
    const colInside = c >= 0 && c < cols;
    return rowInside && colInside;
  }
}
