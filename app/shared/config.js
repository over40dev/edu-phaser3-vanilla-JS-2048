// GLOBAL GAME INSTANCE
var game;

// GAME OPTIONS - 4096
const gameOptions = {
  board: {
    rows: 4,
    cols: 4,
  },
  tiles: {
    tileSize: 200,
    tileSpacing: 20,
  },
  tweenSpeed: 200,
  swipeMaxTime: 1000,
  swipeMinDist: 20,
  swipeMinNormal: 0.85,
};

// GAME CONSTANTS

// moves
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

// tile
const COVER_TILE_VAL = 0;




