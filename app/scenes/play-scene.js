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
      { rows, cols, localStorageName } = gameOptions,
      restartXY = this.getTilePosition(-0.8, cols - 1),
      restartBtn = this.add.sprite(restartXY.x, restartXY.y, 'restart'),
      scoreXY = this.getTilePosition(-0.8, 1),
      scorePanel = this.add.image(scoreXY.x, scoreXY.y, 'scorepanel'),
      scoreLabels = this.add.image(scoreXY.x, scoreXY.y - 70, 'scorelabels'),
      gameTitle = this.add.image(10, 5, 'gametitle'),
      howTo = this.add.image(game.config.width, 5, 'howtoplay'),
      logo = this.add.sprite(game.config.width / 2, game.config.height, 'logo');
    let
      textXY;
      
    textXY = this.getTilePosition(-.92, -.4);
    this.scoreText = this.add.bitmapText(textXY.x, textXY.y, 'font', 0);
    
    textXY = this.getTilePosition(-.92, 1.1);
    this.bestScore = localStorage.getItem(localStorageName);
    if (this.bestScore === null) {
      this.bestScore = 0;
    }
    this.bestScoreText = this.add.bitmapText(textXY.x, textXY.y, 'font', this.bestScore.toString());
    
    this.score = 0

    gameTitle.setOrigin(0, 0);
    howTo.setOrigin(1, 0);
    restartBtn
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('PlayGame');
      });
    logo
      .setOrigin(0.5, 1)
      .setScale(.8, .8)
      .setInteractive()
      .on("pointerdown", () => {
        window.location.href = 'https://juliegirlgames.com'
      });

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
    this.moveSound = this.sound.add('move');
    this.growSound = this.sound.add('grow');
  }

  addTile() {
    const
      emptyTiles = [],
      { cols, rows, tweenSpeed } = gameOptions;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.isEmptyCell(row, col)) {
          emptyTiles.push({ row, col });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const
        { row, col } = CX.getRandomElement(emptyTiles),
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
      const
        // { swipeMinNormal } = gameOptions,
        swipe = CX.getVectorPoint(e.upX - e.downX, e.upY - e.downY);

      if (this.validSwipe(e, swipe)) {
        this.handleMove(swipe);
      }
    }
  }

  validSwipe(e, swipe) {
    const
      { swipeMaxTime, swipeMinDist } = gameOptions,
      swipeTime = e.upTime - e.downTime,
      swipeMagnitude = CX.getMagnitude(swipe),
      fastEnough = swipeTime < swipeMaxTime,
      longEnough = swipeMagnitude > swipeMinDist;

    return longEnough && fastEnough;
  }

  handleMove(swipe) {
    if (!swipe) { return; }

    const
      { swipeMinNormal } = gameOptions,
      { RIGHT, LEFT, UP, DOWN } = gameConstants;

    // CX.setMagnitude(swipe, 1), // normalize vector to magnitude of 1
    Phaser.Geom.Point.SetMagnitude(swipe, 1);
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
              this.score += Math.pow(2, newTile.value);
            } else {
              newTile.value = tileValue;
            }
          }
        }
      }
    }
    if (this.movingTiles === 0) {
      this.canMove = true;
    } else {
      this.moveSound.play();
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
      { rows, cols, localStorageName } = gameOptions;

    this.scoreText.text = this.score.toString();
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(localStorageName, this.bestScore);
      this.bestScoreText.text = this.bestScore.toString();
    }

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
    this.growSound.play();
    this.tweens.add({
      targets: [tileSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: tweenSpeed,
      yoyo: true,
      repeat: 1,
      callbackScope: this,
      onComplete: function () {
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
      { rows, cols, tileSize, tileSpacing } = gameOptions;
    let
      posX = (col + 1) * tileSpacing + (col + .5) * tileSize,
      posY = (row + 1) * tileSpacing + (row + .5) * tileSize,
      boardHeight = (rows + 1) * tileSpacing + (rows * tileSize),
      offsetY = (game.config.height - boardHeight) / 2;

    posY += offsetY;

    // return CX.getVectorPoint(posX, posY);
    return new Phaser.Geom.Point(posX, posY);
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

    if (this.boardArray[row][col].value === 12) {
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
