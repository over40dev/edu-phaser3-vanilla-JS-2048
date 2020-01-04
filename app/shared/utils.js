/**
 * CX allows for common API 
 * to local Util functions 
 * required by app, etc.
 */
const CX = {
  random: (arr) => cxRandom(arr),
  resize: () => cxResize(),
  getVectorPoint: (row, col) => cxGeomPoint(row, col),
  setMagnitude: (swipe) => cxSetMagnitude(swipe),
  getMagnitude: (swipe) => cxGetMagnitude(swipe),
}





/**
 * Utils.js --- CX-Phaser-Lite (just what's used)
 */
function cxResize() {
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

function cxSetMagnitude(swipe) {
  return Phaser.Geom.Point.SetMagnitude(swipe, 1);
}

function cxGetMagnitude(swipe) {
  return Phaser.Geom.Point.GetMagnitude(swipe);
}

