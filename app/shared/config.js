// GLOBAL GAME INSTANCE
var game;

// GAME OPTIONS - 4096
const
  gameOptions = {
    rows: 4,
    cols: 4,
    tileSize: 200,
    tileSpacing: 20,
    tweenSpeed: 50,
    swipeMaxTime: 1000,
    swipeMinDist: 20,
    swipeMinNormal: 0.85,
    aspectRatio: 16/9,
    localStorageName: 'topscore4096',
  },
  gameConstants = {
    COVER_TILE_VAL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
  };

