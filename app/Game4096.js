class Game4096 {
  constructor(obj = {}) {
    const { rows, cols, maxValue } = gameOptions;
    this.rows = (obj.rows !== undefined) ? obj.rows : 4;
    this.cols = (obj.cols !== undefined) ? obj.cols : 4;
    this.maxValue = (obj.maxValue !== undefined) ? obj.maxValue : 11; // 11 => 2048 rules; 12 => 4096 rules
    // lookup table (LUT) --- values to keep in mind when moving tiles
    this.LEFT = {
      deltaRow: 0,
      deltaCol: -1,
      firstRow: 0,
      lastRow: this.rows,
      firstCol: 1,
      lastCol: this.cols,
    };
    this.RIGHT = {
      deltaRow: 0,
      deltaCol: 1,
      firstRow: 0,
      lastRow: this.rows,
      firstCol: 0,
      lastCol: this.cols - 1,
    };
    this.UP = {
      deltaRow: -1,
      deltaCol: 0,
      firstRow: 1,
      lastRow: this.rows,
      firstCol: 0,
      lastCol: this.cols,
    };
    this.DOWN = {
      deltaRow: 1,
      deltaCol: 0,
      firstRow: 0,
      lastRow: this.rows - 1,
      firstCol: 0,
      lastCol: this.cols,
    };
  }
  getRows() {
    return this.rows;
  }
  getCols() {
    return this.cols;
  }
  getMaxValue() {
    return this.maxValue;
  }
  generateGameBoard() {
    this.gameArray = [];
    for (let row = 0; row < this.getRows(); row++) {
      this.gameArray[row] = [];
      for (let col = 0; col < this.getCols(); col++) {
        this.gameArray[row][col] = {
          tileValue: 0,
          customData: null,
          upgraded: false,
        }
      }
    }
  }
  getTileValue(row, col) {
    if (this.isInsideBoard(row, col)) {
      return this.gameArray[row][col].tileValue;
    }
  }
  setTileValue(row, col, value) {
    this.gameArray[row][col].tileValue = value;
  }
  getCustomData(row, col) {
    return this.gameArray[row][col].customData;
  }
  setCustomData(row, col, customData) {
    this.gameArray[row][col].customData = customData;
  }
  setUpgradedTile(row, col, upgraded) {
    this.gameArray[row][col].upgraded = upgraded;
  }
  isEmptyTile(row, col) {
    return this.getTileValue(row, col) === 0;
  }
  isFromToValueEqual(fromVal, toVal) {
    return fromVal === toVal;
  }
  isUpgradedTile(row, col) {
    return this.gameArray[row][col].upgraded;
  }
  isCappedTile(row, col) {
    return this.getTileValue(row, col) === this.getMaxValue();
  }
  resetUpgradedTiles() {
    for (let row = 0; row < this.getRows(); row++) {
      for (let col = 0; col < this.getCols(); col++) {
        this.setUpgradedTile(row, col, false);
      }
    }
  }
  upgradeTile(row, col) {
    this.setTileValue(row, col, this.getTileValue(row, col) + 1);
    this.setUpgradedTile(row, col, true);
  }
  isInsideBoard(row, col) {
    return (
      row >= 0 && row < this.getRows() &&
      col >= 0 && col < this.getCols()
    );
  }
  isLegalMove(row, col, value) {
    return (
      this.isInsideBoard(row, col) &&
      !this.isCappedTile(row, col) &&
      (this.isEmptyTile(row, col) || (this.getTileValue(row, col) === value) && !this.isUpgradedTile(row, col))
    );
  }
  addTile() {
    let emptyTiles = [];
    for (let row = 0; row < this.getRows(); row++) {
      for (let col = 0; col < this.getCols(); col++) {
        if (this.isEmptyTile(row, col)) {
          emptyTiles.push({
            row,
            col,
          });
        }
      }
    }
    if (emptyTiles.length > 0) {
      let chosenTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      this.setTileValue(chosenTile.row, chosenTile.col, 1);
      return chosenTile;
    }
  }
  moveBoard({
    firstRow, lastRow, deltaRow,
    firstCol, lastCol, deltaCol,
  }) {

    const movements = [];
    for (let row = firstRow; row < lastRow; row++) {
      for (let col = firstCol; col < lastCol; col++) {
        let
          curRow = deltaRow === 1 ? (lastRow - 1) - row : row,
          curCol = deltaCol === 1 ? (lastCol - 1) - col : col;
        if (!this.isEmptyTile(curRow, curCol)) {
          let
            tileValue = this.getTileValue(curRow, curCol),
            newRow = curRow,
            newCol = curCol;

          while (this.isLegalMove(newRow + deltaRow, newCol + deltaCol, tileValue)) {
            newRow += deltaRow;
            newCol += deltaCol;
          }
          if (newRow !== curRow || newCol !== curCol) {
            this.setTileValue(curRow, curCol, 0);
            if (this.getTileValue(newRow, newCol) === tileValue) {
              this.upgradeTile(newRow, newCol);
            } else {
              this.setTileValue(newRow, newCol, tileValue);
            }
            movements.push({
              from: {
                row: curRow,
                col: curCol,
                value: tileValue,
              },
              to: {
                row: newRow,
                col: newCol,
                value: this.getTileValue(newRow, newCol),
              }
            });

          }
        }
      }
    }
    this.resetUpgradedTiles();
    return movements;
  }
}
