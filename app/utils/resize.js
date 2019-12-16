/**
 * Utils.js embedded
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
  console.log('resize',
    canvas,
    windowWidth,
    windowHeight,
    windowRatio,
    gameRatio,
    );
  console.log('game w-h', game.config.width, game.config.height);

}
