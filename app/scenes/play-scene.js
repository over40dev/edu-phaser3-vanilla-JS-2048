/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {

  constructor() {
    super('PlayGame');
  }

  create() {
    const
      { rows, cols, localStorageName, max2048: maxValue } = gameOptions;
    
      this.game4096 = new Game4096({
      rows,
      cols,
      maxValue,
    });

    const
      restartXY = this.getTilePosition(-0.8, cols - 1),
      restartBtn = this.add.sprite(restartXY.x, restartXY.y, 'restart'),
      fullScreenButton = this.add.sprite(restartBtn.x, restartBtn.y - 120, 'fullscreen'),
      gameTitle = this.add.image(10, 5, 'gametitle'),
      howTo = this.add.image(game.config.width, 5, 'howtoplay'),
      logo = this.add.sprite(game.config.width / 2, game.config.height, 'logo');
    let
      scoreXY,
      textXY;

    scoreXY = this.getTilePosition(-0.8, 1);
    this.add.image(scoreXY.x, scoreXY.y, 'scorepanel');
    this.add.image(scoreXY.x, scoreXY.y - 70, 'scorelabels');

    textXY = this.getTilePosition(-.92, -.4);
    this.scoreText = this.add.bitmapText(textXY.x, textXY.y, 'font', 0);

    textXY = this.getTilePosition(-.92, 1.1);
    this.bestScore = localStorage.getItem(localStorageName) || 0;
    this.bestScoreText = this.add.bitmapText(textXY.x, textXY.y, 'font', this.bestScore.toString());

    this.score = 0;

    gameTitle.setOrigin(0, 0);
    howTo.setOrigin(1, 0);

    fullScreenButton
      .setInteractive()
      .on('pointerup', () => {
        if (!this.scale.isFullscreen) {
          this.scale.startFullscreen();
        } else {
          this.scale.stopFullscreen();
        }
      });

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
    this.game4096.generateGameBoard();

    for (let row = 0; row < this.game4096.getRows(); row++) {
      for (let col = 0; col < this.game4096.getCols(); col++) {
        const { x, y } = this.getTilePosition(row, col);
        this.add.image(x, y, 'emptytile');
        const tileSprite = this.add.sprite(x, y, 'tiles', 0);
        tileSprite.visible = false;
        this.game4096.setCustomData(row, col, tileSprite);
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
      { tweenSpeed } = gameOptions,
      { row, col } = this.game4096.addTile(),
      tileSprite = this.game4096.getCustomData(row, col);

    tileSprite.visible = true;
    tileSprite.setFrame(0);
    tileSprite.alpha = 0;
    this.tweens.add({
      targets: tileSprite,
      alpha: 1,
      duration: tweenSpeed,
      callbackScope: this,
      onComplete: () => { this.canMove = true },
    });
  }

  getTilePosition(row, col) {
    const
      { rows, tileSize, tileSpacing } = gameOptions;
    let
      posX = (col + 1) * tileSpacing + (col + .5) * tileSize,
      posY = (row + 1) * tileSpacing + (row + .5) * tileSize,
      offsetY = 0,
      boardHeight = 0;

    boardHeight += this.game4096.getRows() * tileSize;
    boardHeight += (this.game4096.getRows() + 1) * tileSpacing;
    offsetY += (game.config.height - boardHeight) / 2;
    posY += offsetY;

    return CX.getVectorPoint(posX, posY);
  }

  handleKey(e) {
    if (!this.canMove) return;
    // look for WASD and arrow keys to move using keyboard

    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        this.makeMove(this.game4096.LEFT);
        break;
      case "ArrowRight":
      case "KeyD":
        this.makeMove(this.game4096.RIGHT);
        break;
      case "ArrowUp":
      case "KeyW":
        this.makeMove(this.game4096.UP);
        break;
      case "ArrowDown":
      case "KeyS":
        this.makeMove(this.game4096.DOWN);
        break;

      default:
        break;
    }
  }

  handleSwipe(e) {
    if (this.canMove) return;

    const
      // { swipeMinNormal } = gameOptions,
      swipe = CX.getVectorPoint(e.upX - e.downX, e.upY - e.downY);

    if (this.validSwipe(e, swipe)) {
      this.handleMove(swipe);
    }
  }

  validSwipe(e, swipe) {
    if (!e || !swipe) return false;

    const
      { swipeMaxTime, swipeMinDist } = gameOptions,
      swipeTime = e.upTime - e.downTime,
      fastEnough = swipeTime < swipeMaxTime,
      swipeMagnitude = CX.getMagnitude(swipe),
      longEnough = swipeMagnitude > swipeMinDist;

    return longEnough && fastEnough;
  }

  handleMove(swipe) {
    if (!swipe) return;

    const
      { swipeMinNormal } = gameOptions;

    CX.setMagnitude(swipe, 1); // normalize vector to magnitude of 1
    if (swipe.x > swipeMinNormal) {
      this.makeMove(this.game4096.RIGHT);
    }
    if (swipe.x < -swipeMinNormal) {
      this.makeMove(this.game4096.LEFT);
    }
    if (swipe.y > swipeMinNormal) {
      this.makeMove(this.game4096.DOWN);
    }
    if (swipe.y < -swipeMinNormal) {
      this.makeMove(this.game4096.UP);
    }
  }

  makeMove(direction = null) {
    if (!direction) return;

    const movements = this.game4096.moveBoard(direction);

    if (movements.length > 0) {
      this.canMove = false;
      this.movingTiles = 0;
      this.moveSound.play();
      movements.forEach(move => {
        const
          newPos = this.getTilePosition(move.to.row, move.to.col),
          shouldUpgrade = move.from.value !== move.to.value;

        this.moveTile(this.game4096.getCustomData(move.from.row, move.from.col), newPos, shouldUpgrade);
        if (shouldUpgrade) {
          this.score += Math.pow(2, move.to.value);
        }
      });
    }
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
    const { tweenSpeed } = gameOptions;

    this.growSound.play();
    tileSprite.setFrame(tileSprite.frame.name + 1);
    this.tweens.add({
      targets: [tileSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: tweenSpeed,
      yoyo: true,
      repeat: 1,
      callbackScope: this,
      onComplete() {
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

  refreshBoard() {
    const
      { localStorageName } = gameOptions;

    this.scoreText.text = this.score.toString();
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(localStorageName, this.bestScore);
      this.bestScoreText.text = this.bestScore.toString();
    }

    for (let row = 0; row < this.game4096.getRows(); row++) {
      for (let col = 0; col < this.game4096.getCols(); col++) {
        const
          { x, y } = this.getTilePosition(row, col),
          tileValue = this.game4096.getTileValue(row, col);

        this.game4096.getCustomData(row, col).x = x;
        this.game4096.getCustomData(row, col).y = y;

        if (tileValue > 0) {
          this.game4096.getCustomData(row, col).visible = true;
          this.game4096.getCustomData(row, col).setFrame(tileValue - 1);
        } else {
          this.game4096.getCustomData(row, col).visible = false;
        }
      }
    }
    this.addTile();
  }
}
