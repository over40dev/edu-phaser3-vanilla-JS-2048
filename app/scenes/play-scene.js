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
      CX.setMagnitude(swipe);
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

  /** TODO: makeMove impl */
  _makeMove(dir) {
    console.log('move: ', dir);
  }
}
