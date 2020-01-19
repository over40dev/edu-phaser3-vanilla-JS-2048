// GLOBAL GAME INSTANCE
var game;

// GAME OPTIONS - 4096
const
  gameOptions = {
    rows: 4,
    cols: 4,
    tileSize: 200,
    tileSpacing: 20,
    tweenSpeed: 200,
    swipeMaxTime: 1000,
    swipeMinDist: 20,
    swipeMinNormal: 0.85,
  },
  gameConstants = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    COVER_TILE_VAL: 0,
  };

