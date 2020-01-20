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
        const tileSprite = this.add.sprite(x, y, 'tiles', 0);
        tileSprite.visible = false;
        this.boardArray[row][col] = {
          value: COVER_TILE_VAL,
          sprite: tileSprite,
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
      { cols, rows, tweenSpeed } = gameOptions;

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < rows; col++) {
        if (this.isEmptyCell(row, col)) {
          emptyTiles.push({ row, col });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const
        { row, col } = CX.random(emptyTiles),
        chosenTile = this.boardArray[row][col];

      if (!!chosenTile) {
        chosenTile.value = 1;
        chosenTile.sprite.visible = true;
        chosenTile.sprite.setFrame(0);
        chosenTile.sprite.alpha = 0;
        this.tweens.add({
          targets: [chosenTile.sprite],
          alpha: 1,
          duration: tweenSpeed,
          callbackScope: this,
          onComplete: () => { this.canMove = true },
        });
      }
    }
  }

  isEmptyCell(row, col) {
    const
      { COVER_TILE_VAL } = gameConstants;

    return (this.boardArray[row][col].value === COVER_TILE_VAL);
  }

  handleKey(e) {
    console.log(e, this.canMove);
    if (this.canMove) {
      // look for WASD and arrow keys to move using keyboard
      const
        { LEFT, RIGHT, UP, DOWN } = gameConstants;

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
        const
          { x, y } = CX.setMagnitude(swipe, 1), // normalize vector to magnitude of 1
          direction = this.getDirection(x, y);

        if (direction) {
          this.makeMove(direction);
        }
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

  /** TODO: makeMove impl v04 */
  makeMove(d = null) {
    if (d) {
      this.movingTiles = 0;
      this.canMove = false;
    } else {
      return null;
    }

    const
      { COVER_TILE_VAL } = gameConstants,
      { dRow, dCol, firstRow, lastRow, firstCol, lastCol, }
        = this.setMoveOptions(d);

    for (let row = firstRow; row < lastRow; row++) {
      for (let col = firstCol; col < lastCol; col++) {
        const
          curRow = dRow === 1 ? (lastRow - 1) - row : row,
          curCol = dCol === 1 ? (lastCol - 1) - col : col,
          curTile = this.boardArray[curRow][curCol],
          tileValue = curTile.value;

        if (tileValue !== 0) {
          let newRow = curRow;
          let newCol = curCol;
          while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
            newRow += dRow;
            newCol += dCol;
          }

          if (newRow !== curRow || newCol !== curCol) {
            const
              newTile = this.boardArray[newRow][newCol],
              newPos = this.getTilePosition(newRow, newCol),
              willUpdate = newTile.value === tileValue;

            this.moveTile(curTile.sprite, newPos, willUpdate);
            this.updateTilePosition(curTile, newTile);
            curTile.value = COVER_TILE_VAL;
            if (willUpdate) {
              newTile.value++;
              newTile.upgraded = true;
            } else {
              newTile.value = tileValue;
            }
          }
        }
      }
    }
    if (this.movingTiles === 0) {
      this.canMove = true;
    }
  }

  setMoveOptions(d) {
    const
      { LEFT, RIGHT, UP, DOWN } = gameConstants,
      { rows, cols } = gameOptions;

    return {
      dRow: (d === LEFT || d === RIGHT) ? 0 : (d === UP) ? -1 : 1,
      dCol: (d === UP || d === DOWN) ? 0 : (d === LEFT) ? -1 : 1,
      firstRow: (d === UP) ? 1 : 0,
      lastRow: rows - ((d === DOWN) ? 1 : 0),
      firstCol: (d === LEFT) ? 1 : 0,
      lastCol: cols - ((d === RIGHT) ? 1 : 0),
    }
  }

  refreshBoard() {
    const
      { COVER_TILE_VAL } = gameConstants,
      { rows, cols } = gameOptions;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const
          { x, y } = this.getTilePosition(row, col),
          tile = this.boardArray[row][col];

        tile.sprite.x = x;
        tile.sprite.y = y;
        if (tile.value > 0) {
          tile.sprite.visible = true;
          tile.sprite.setFrame(tile.value - 1);
          tile.upgraded = false;
        } else {
          tile.sprite.visible = false;
        }
      }
    }
    this.addTile();
  }

  moveTile(tileSprite, newPos, upgrade) {
    const
      { tweenSpeed, tileSize } = gameOptions;

    this.movingTiles++;
    tileSprite.depth = this.movingTiles;
    const distance = Math.abs(tileSprite.x - newPos.x) + Math.abs(tileSprite.y - newPos.y);
    this.tweens.add({
      targets: [tileSprite],
      x: newPos.x,
      y: newPos.y,
      duration: tweenSpeed * distance / tileSize,
      callbackScope: this,
      onComplete: function () {
        if (upgrade) {
          this.upgradeTile(tileSprite);
        } else {
          this.endTween(tileSprite);
        }
      }
    })
  }

  upgradeTile(tileSprite) {
    const
      { tweenSpeed } = gameOptions;
    
    tileSprite.setFrame(tileSprite.frame.name + 1);
    this.tweens.add({
      targets: [tileSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: tweenSpeed,
      yoyo: true,
      repeat: 1,
      callbackScope: this,
      onComplete: function() {
        this.endTween(tileSprite);
      }
    });
  }

  endTween(tileSprite) {
    this.movingTiles--;
    tileSprite.depth = 0;
    if (this.movingTiles === 0) {
      this.refreshBoard();
    }
  }

  updateTilePosition(curTile, newTile) {
    if (newTile.value === curTile.value) {
      newTile.value++;
      newTile.upgraded = true;
      curTile.sprite.setFrame(curTile.value);
    } else {
      newTile.value = curTile.value;
    }
  }

  getTilePosition(row, col) {
    const
      { tileSize, tileSpacing } = gameOptions,
      posX = (col + 1) * tileSpacing + (col + .5) * tileSize,
      posY = (row + 1) * tileSpacing + (row + .5) * tileSize;

    return CX.getVectorPoint(posX, posY);
  }

  /** @summary check if legal move by verifying position
   * @param {number} row 
   * @param {number} col 
   * @param {number} value 
   */
  isLegalPosition(row, col, value) {
    const
      { rows, cols } = gameOptions,
      { COVER_TILE_VAL } = gameConstants,
      rowInside = row >= 0 && row < rows,
      colInside = col >= 0 && col < cols;

    if (!rowInside || !colInside) {
      return false;
    }
    const
      tile = this.boardArray[row][col],
      emptySpot = tile.value === COVER_TILE_VAL,
      sameValue = tile.value === value,
      alreadyUpgraded = tile.upgraded;

    // 2 legal positions to move --- empty && same tile value
    return (emptySpot || (sameValue && !alreadyUpgraded));
  }
}
