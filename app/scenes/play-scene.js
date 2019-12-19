/**
 * play-game.js embedded
 */
class PlayGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  create() {    
    const {rows, cols} = game4096.board;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const [xPos, yPos] = this._position(row, col);
        this.add.image(
          xPos,
          yPos,
          'emptytile'
        );
      }
      
    }
  }

  _position(row, col) {
    const {tileSize, tileSpacing} = game4096.tiles;
    const xPos = tileSpacing + tileSize/2 + (col *  (tileSpacing + tileSize));
    const yPos = tileSpacing + tileSize/2 + (row *  (tileSpacing + tileSize));
    return [xPos, yPos];
  }
}
