/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  constructor() {
    super('PlayGame');
  }

  create() {
    const
      { COVER_TILE_VAL } = gameConstants,
      { rows, cols } = gameOptions;

    this.canMove = false;
    this.boardArray = [];

    for (let row = 0; row < rows; row++) {
      this.boardArray[row] = [];
      for (let col = 0; col < cols; col++) {
        const { x, y } = this.getTilePosition(row, col);
        this.add.image(x, y, 'emptytile');
        const tile = this.add.sprite(x, y, 'tiles', 0);
        tile.visible = false;
        this.boardArray[row][col] = {
          value: COVER_TILE_VAL,
          sprite: tile,
          upgraded: false,
        };
      }
    }
    this.addTile();
    this.addTile();
    this.input.keyboard.on('keydown', this.handleKey, this);
    this.input.on('pointerup', this.handleSwipe, this);
  }

  addTile() {
    const
      emptyTiles = [],
      { cols, rows } = gameOptions;

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < rows; col++) {
        if (this.isEmptyCell(row, col)) {
          emptyTiles.push({ row, col });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const
        { row, col } = cxRandom(emptyTiles),
        chosenTile = this.boardArray[row][col];

      chosenTile.value = 1;
      chosenTile.sprite.visible = true;
      chosenTile.sprite.setFrame(0);
      chosenTile.sprite.alpha = 0;
      this.tweens.add({
        targets: [chosenTile.sprite],
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: () => { this.canMove = true },
      });
    }
  }

  isEmptyCell(row, col) {
    const
      { COVER_TILE_VAL } = gameConstants;

    return (this.boardArray[row][col].value === COVER_TILE_VAL);
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
        case "ArrowUp":
        case "KeyW":
          this.makeMove(UP);
          break;
        case "ArrowDown":
        case "KeyS":
          this.makeMove(DOWN);
          break;

        default:
          break;
      }
    }
  }

  handleSwipe(e) {
    if (this.canMove) {
      const swipe = CX.getVectorPoint(e.upX - e.downX, e.upY - e.downY)
      if (this.validSwipe(e, swipe)) {
        CX.setMagnitude(swipe, 1); // normalize vector to magnitude of 1
        const direction = this.getDirection(swipe);
        this.makeMove(direction);
      }
    }
  }
  validSwipe(e, swipe) {
    const
      { swipeMaxTime, swipeMinDist, swipeMinNormal } = gameOptions,
      swipeTime = e.upTime - e.downTime,
      swipeMagnitude = CX.getMagnitude(swipe),
      fastEnough = swipeTime < swipeMaxTime,
      longEnough = swipeMagnitude > swipeMinDist;

    return longEnough && fastEnough;
  }

  getDirection(swipe) {
    const
      { LEFT, RIGHT, UP, DOWN } = gameConstants,
      { swipeMinNormal } = gameOptions;

    if (swipe.x > swipeMinNormal) {
      return RIGHT;
    } else if (swipe.x < -swipeMinNormal) {
      return LEFT;
    } else if (swipe.y > swipeMinNormal) {
      return DOWN;
    } else if (swipe.y < -swipeMinNormal) {
      return UP;
    } else {
      return null;
    }
  }

  /** TODO: makeMove impl v03 */
  makeMove(d) {
    this.movingTiles = 0;
    this.configGameOptions(d);
    const { firstRow, lastRow, firstCol, lastCol, dRow, dCol, } = this;
    this.canMove = false;

    for (let row = firstRow; row < lastRow; row++) {
      for (let col = firstCol; col < lastCol; col++) {
        const curRow = dRow === 1 ? (lastRow - 1) - row : row;
        const curCol = dCol === 1 ? (lastCol - 1) - col : col;
        const curTile = this.boardArray[curRow][curCol];
        const curVal = curTile.value;

        if (curVal != COVER_TILE_VAL) {
          let newRow = curRow;
          let newCol = curCol;
          while (this.isLegalPosition(newRow + dRow, newCol + dCol, curVal)) {
            newRow += dRow;
            newCol += dCol;
          }
          movedTiles++;
          if (newRow !== curRow || newCol !== curCol) {
            movedSomething = true;
            curTile.depth = movedTiles;
            const newTile = this.boardArray[newRow][newCol];
            const newPos = this.getTilePosition(newRow, newCol);
            this.updateTilePosition(curTile, newTile, newPos, curVal);
          }
        }
      }
    }
    if (movingTiles === 0) {
      this.canMove = true;
    }
  }

  refreshBoard() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const
          { COVER_TILE_VAL } = this.tiles,
          { x, y } = this.getTilePosition(row, col),
          { sprite, value } = this.boardArray[row][col];

        sprite.x = x;
        sprite.y = y;
        if (value > COVER_TILE_VAL) {
          sprite.visible = true;
          sprite.setFrame(value - 1);
          this.boardArray[row][col].upgraded = false;
        } else {
          sprite.visible = false;
        }
      }
    }
    this.addTile();
  }

  getTilePosition(row, col) {
    const { tileSize, tileSpacing } = gameOptions;

    return cxGeomPoint(
      (row + 1) * tileSpacing + (row + .5) * tileSize,
      (col + 1) * tileSpacing + (col + .5) * tileSize,
    );
  }

  updateTilePosition(curTile, newTile, newPos, curVal) {
    curTilechosenTile.sprite.x = newPos.x;
    curTilechosenTile.sprite.y = newPos.y;
    curTile.value = 0;
    if (newTile.value === curVal) {
      newTile.value++;
      newTile.upgraded = true;
      curTilechosenTile.sprite.setFrame(curVal)
    } else {
      newTile.value = curVal;
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
      const emptySpot = this.boardArray[row][col].value === COVER_TILE_VAL;
      const sameValue = this.boardArray[row][col].value === value;
      const alreadyUpgraded = this.boardArray[row][col].upgraded;

      return (emptySpot || (sameValue && !alreadyUpgraded));
    }
    return false;
  }
}

