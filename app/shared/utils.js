/**
 * Utils.js --- resize game function
 */
function resizeGame() {
  var canvas = document.querySelector('canvas');
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;

  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = (windowWidth / gameRatio) + 'px';
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px';
    canvas.style.height = windowHeight + 'px';
  }
  // console.log('resize',
  //   canvas,
  //   windowWidth,
  //   windowHeight,
  //   windowRatio,
  //   gameRatio,
  // );

}

// Based on CX use of Phaser game methods and objects
function cxGeomPoint(row, col) {
  return {
    x: col,
    y: row,
  };
}

function cxRandom(arr) {
  return Phaser.Utils.Array.GetRandom(arr);
}
