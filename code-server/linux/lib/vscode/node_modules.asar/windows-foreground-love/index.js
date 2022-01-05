var foregroundLove = null;
var tried = false;

exports.allowSetForegroundWindow = function (pid) {
  if (process.platform !== 'win32') {
    return false;
  }

  if (!tried) {
    tried = true;
    try {
      foregroundLove = require('./build/Release/foreground_love');
    } catch (err) {
      console.error(err);
    }
  }

  if (!foregroundLove) {
    return false;
  }

  var r = false;
  try {
    r = foregroundLove.allowSetForegroundWindow(pid);
  } catch (err) {
    console.error(err);
  }
  return r;
};
