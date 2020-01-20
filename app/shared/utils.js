/**
 * CX allows for common API 
 * to local Util functions 
 * required by app, etc.
 */
const CX = {
  resize: () => cxResize(),
  random: (arr) => cxGetRandomElement(arr),
  getVectorPoint: (posX, posY) => cxGeomPoint(posX, posY),
  setMagnitude: (swipe, mag) => cxSetMagnitude(swipe, mag),
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
}

// Based on CX use of Phaser game methods and objects
function cxGeomPoint(posX, posY) {
  return new Phaser.Geom.Point(posX, posY);
}

function cxGetRandomElement(arr) {
  return Phaser.Utils.Array.RemoveRandomElement(arr);
}

function cxSetMagnitude(swipe, mag = 1) {
  return Phaser.Geom.Point.SetMagnitude(swipe, mag);
}

function cxGetMagnitude(swipe) {
  return Phaser.Geom.Point.GetMagnitude(swipe);
}

