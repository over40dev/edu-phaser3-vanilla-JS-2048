/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  constructor() {
    super('PlayGame');
  }

  preload() {
    this.configProps();
  }

  create() {
    this.canMove = false;
    this.boardArray = [];
    const { cols, rows } = this;

    for (let row = 0; row < rows; row++) {
      this.boardArray[row] = [];
      for (let col = 0; col < cols; col++) {
        const { x, y } = this.getTilePosition(row, col);
        this.add.image(x, y, 'emptytile');
        const tile = this.add.sprite(x, y, 'tiles', 0);
        tile.visible = false;
        this.boardArray[row][col] = {
          tileValue: COVER_TILE_VAL,
          tileSprite: tile,
        };
      }
    }
    this.addTile();
    this.addTile();
    this.input.keyboard.on('keydown', this.handleKey, this);
    this.input.on('pointerup', this.handleSwipe, this);
  }

  addTile() {
    const emptyTiles = [];
    const { cols, rows } = this;

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < rows; col++) {
        if (this.isEmptyCell(row, col)) {
          emptyTiles.push({ row, col });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } = cxRandom(emptyTiles);
      const board = this.boardArray[row][col];
      board.tileValue = 1;
      board.tileSprite.visible = true;
      board.tileSprite.setFrame(0);
      board.tileSprite.alpha = 0;
      this.tweens.add({
        targets: [board.tileSprite],
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: () => { this.canMove = true },
      });
    }
  }

  isEmptyCell(row, col) {
    return (this.boardArray[row][col].tileValue === COVER_TILE_VAL);
  }

  handleKey(e) {
    if (this.canMove) {
      // look for WASD and arrow keys to move using keyboard
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          this.makeMove(LEFT);
          break;
        case "ArrowRight":
        case "KeyD":
          this.makeMove(RIGHT);
          break;
        case "KeyW":
        case "ArrowUp":
          this.makeMove(UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this.makeMove(DOWN);
          break;

        default:
          break;
      }
    }
  }

  handleSwipe(e) {
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
          this.makeMove(RIGHT);
        }
        if (swipe.x < -swipeMinNormal) {
          this.makeMove(LEFT);
        }
        if (swipe.y > swipeMinNormal) {
          this.makeMove(DOWN);
        }
        if (swipe.y < -swipeMinNormal) {
          this.makeMove(UP);
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

  /** TODO: makeMove impl v03 */
  makeMove(d) {
    this.canMove = false;
    this.configProps(d);
    const {firstRow, lastRow, firstCol, lastCol, dRow, dCol,} = this;
    let movedTiles = 0;
    for (let row = firstRow; row < lastRow; row++) {
      for (let col = firstCol; col < lastCol; col++) {
        const _curRow = dRow === 1 ? (lastRow - 1) - row : row;
        const _curCol = dCol === 1 ? (lastCol - 1) - col : col;
        const _curTile = this.boardArray[_curRow][_curCol];
        const _curVal = _curTile.tileValue;

        if (_curVal != COVER_TILE_VAL) {
          let newRow = _curRow;
          let newCol = _curCol;
          while (this.isLegalPosition(newRow + dRow, newCol + dCol, _curVal)) {
            newRow += dRow;
            newCol += dCol;
          }
          movedTiles++;
          _curTile.depth = movedTiles;
          const newTile = this.boardArray[newRow][newCol];
          const newPos = this.getTilePosition(newRow, newCol);
          this.updateTilePosition(_curTile, newTile, newPos, _curVal);
        }
      }
    }
    this.refreshBoard();
  }

  refreshBoard() {
    const { rows, cols } = this;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const { x, y } = this.getTilePosition(row, col);
        const sprite = this.boardArray[row][col].tileSprite;
        const tileValue = this.boardArray[row][col].tileValue;
        sprite.x = x;
        sprite.y = y;
        if (tileValue > COVER_TILE_VAL) {
          sprite.visible = true;
          sprite.setFrame(tileValue - 1);
        } else {
          sprite.visible = false;
        }
      }
    }
    this.addTile();
  }

  /**
   * direction: LEFT | RIGHT | UP | DOWN
   * @param {enum} d 
   */
  configProps(d = null) {
    const { rows, cols } = gameOptions.board;
    const { tileSize, tileSpacing } = gameOptions.tiles;
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.tileSpacing = tileSpacing;
    if (d) { // MOVE direction
      this.dRow = (d === LEFT || d === RIGHT) ? 0 : (d === DOWN) ? 1 : -1;
      this.dCol = (d === UP || d === DOWN) ? 0 : (d === RIGHT) ? 1 : -1;
      this.firstRow = (d === UP) ? 1 : 0;
      this.lastRow = rows - ((d === DOWN) ? 1 : 0);
      this.firstCol = (d === LEFT) ? 1 : 0;
      this.lastCol = cols - ((d === RIGHT) ? 1 : 0);
    }

  }

  getTilePosition(row, col) {
    const { tileSize, tileSpacing } = this;
    return cxGeomPoint(
      (row + 1) * tileSpacing + (row + .5) * tileSize,
      (col + 1) * tileSpacing + (col + .5) * tileSize,
    );
  }

  updateTilePosition(curTile, newTile, newPos, curVal) {
    curTile.tileSprite.x = newPos.x;
    curTile.tileSprite.y = newPos.y;
    curTile.tileValue = 0;
    if (newTile.tileValue === curVal) {
      newTile.tileValue++;
      curTile.tileSprite.setFrame(curVal)
    } else {
      newTile.tileValue = curVal;
    }
  }

  /**
   * 
   * @param {number} row 
   * @param {number} col 
   * @param {number} value 
   */
  isLegalPosition(row, col, value) {
    const rowInside = row >= 0 && row < this.rows;
    const colInside = col >= 0 && col < this.cols;
    
    if (rowInside && colInside) {
      // 2 legal positions to move --- empty && same tile value
      const emptySpot = this.boardArray[row][col].tileValue === COVER_TILE_VAL;
      const sameValue = this.boardArray[row][col].tileValue === value;
  
      return (emptySpot || sameValue);
    } 
    return false;
  }
}
