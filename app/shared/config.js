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
    max1024: 10,  // 2^12=4096; 2^11=2048; 2^10=1024 (option in game to choose; technically controlled by this value set to 10, 11, or default of 12)
    max2048: 11,  // 2^12=4096; 2^11=2048; 2^10=1024 (option in game to choose; technically controlled by this value set to 10, 11, or default of 12)
    max4096: 12,  // 2^12=4096; 2^11=2048; 2^10=1024 (option in game to choose; technically controlled by this value set to 10, 11, or default of 12)
  },
  gameConstants = {
    COVER_TILE_VAL: 0,
  };

