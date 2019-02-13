const request = require("request");
var gui = window.require('nw.gui');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const platform = os.platform();
const exec = require('child_process').exec;

if (platform.includes("win32")) {
  var hxripper = process.env.APPDATA + '\\hxripper';
  var configFolderHome = hxripper + '\\config';
  var settingsFile = configFolderHome + '\\settings.json';
  var homeFolder = process.env.APPDATA;
} else if (platform.includes("darwin")) {
  var hxripper = process.env.HOME + '/Library/hxripper';
  var configFolderHome = hxripper + '/config';
  var settingsFile = configFolderHome + '/settings.json';
  var homeFolder = process.env.HOME;
} else if (platform.includes("linux")) {
  var hxripper = process.env.HOME + "/.hxripper";
  var configFolderHome = hxripper + '/config';
  var settingsFile = configFolderHome + '/settings.json';
  var homeFolder = process.env.HOME;
}

const lang = require('../app/lang');
const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
if (settings.savePictureLocation == "") {
  var savePicLocation = path.normalize(homeFolder + '/') + (new Date().toISOString() + '.jpg').split(':').join('-');
  var saveLivePicLocation = path.normalize(homeFolder + '/');
} else {
  var savePicLocation = path.normalize(settings.savePictureLocation + '/') + (new Date().toISOString() + '.jpg').split(':').join('-');
  var saveLivePicLocation = path.normalize(settings.savePictureLocation + '/');
}
const iconPath = 'file://' + nw.__dirname + '/assets/icon.png';
var mRequestId = 1;

function id() {
  return mRequestId++;
}
function setShootMode(mode) {
  // We need "movie" for video recording and "still" for taking pictures
  const options = {
    uri: settings.cameraUrl,
    body: { "method": "setShootMode", "params": [mode], "id": id(), "version": "1.0" },
    method: 'POST',
    json: true
  };
  request(options, function (error, response, body) {
    //console.log("Shoot mode is now: " + mode);
  });
}
module.exports = {
  actTakePicture: function () {
    setShootMode("still");
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: {
        "method": "actTakePicture", "params": [], "id": id(), "version": "1.0"
      },
      method: 'POST',
      json: true
    };
    setTimeout(function () {
      request(options, function (error, response, body) {
        // It looks like it supports set of photos here
        console.log(body);
        try {
          if (typeof body.result == 'undefined') {
            alert(lang.echo("Connection was successful, but camera returned error\nIt might be something prevents camera from going into still mode\nTry to increase shooting response"));
          } else {
            photo = body.result[0];
            if (settings.autoSavePicture == true) {
              const alert = {
                icon: iconPath,
                body: lang.echo("Location: ") + savePicLocation
              };
              new Notification(lang.echo("Image was saved"), alert);
              gui.Window.open(photo[0], {
                position: 'center',
                width: 800,
                height: 600
              });
              request
                .get(photo[0])
                .on('error', function (err) {
                  console.log(err);
                })
                .pipe(fs.createWriteStream(savePicLocation));
            } else {
              gui.Window.open(photo[0], {
                position: 'center',
                width: 800,
                height: 600
              });
            }
          }
        } catch (e) {
          if (e) {
            alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
          }
        }
      });
    }, settings.takePictureResponse);
  },
  startLive: function () {
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: { "method": "startLiveview", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    if (settings.liveViewUrl == undefined) {
      var liveViewUrl = 'http://10.0.0.1:60152';
    } else {
      var liveViewUrl = settings.liveViewUrl;
    }
    request(options, function (error, response, body) {
      //console.log(body.result[0]);
      try {
        if (typeof body.result == 'undefined') {
          alert("Connection was successful, but camera returned error");
        } else {
          if (platform.includes("win32")) {
            process.env.CAM_LV = liveViewUrl;
            exec((process.execPath).slice(0, -15) + '\\bin\\liveView.exe');
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview started")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          } else if (platform.includes("darwin")) {
            process.env.CAM_LV = liveViewUrl;
            exec(global.__dirname + '/bin/liveView');
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview started")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          } else if (platform.includes("linux")) {
            process.env.CAM_LV = liveViewUrl;
            exec((process.execPath).slice(0, -11) + '/bin/liveView');
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview started")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          }
        }
      } catch (e) {
        if (e) {
          alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
        }
      }
    });
  },
  startLiveHydra: function () {
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: { "method": "startLiveview", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    if (settings.liveViewUrl == undefined) {
      var liveViewUrl = 'http://10.0.0.1:60152';
    } else {
      var liveViewUrl = settings.liveViewUrl;
    }
    request(options, function (error, response, body) {
      //console.log(body.result[0]);
      try {
        if (typeof body.result == 'undefined') {
          alert("Connection was successful, but camera returned error");
        } else {
          if (platform.includes("win32")) {
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview started, but hydra not supported")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          } else if (platform.includes("darwin")) {
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview started, but hydra not supported")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          } else if (platform.includes("linux")) {
            liveViewUrl = liveViewUrl.replace('http://', '');
            var newSaveLivePicLocation = saveLivePicLocation + path.normalize(new Date().toISOString().split(':').join('-') + '/');
            fs.mkdirSync(newSaveLivePicLocation);
            if (process.arch == "x64") {
              exec((process.execPath).slice(0, -11) + '/bin/hydra-x64 --primary-res 640x480 --cam-link ' + liveViewUrl + ' --save-file sony_%05d.jpeg --save-dir ' + newSaveLivePicLocation);
            } else {
              exec((process.execPath).slice(0, -11) + '/bin/hydra-x32 --primary-res 640x480 --cam-link ' + liveViewUrl + ' --save-file sony_%05d.jpeg --save-dir ' + newSaveLivePicLocation);
            }
            const alert = {
              icon: iconPath,
              body: lang.echo("Control preview window with s(save) and q(exit) keys")
            };
            new Notification(lang.echo("Live preview activated"), alert);
          }
        }
      } catch (e) {
        if (e) {
          alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
        }
      }
    });
  },
  stopLive: function () {
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: { "method": "stopLiveview", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      //console.log(body);
      try {
        if (typeof body.result == 'undefined') {
          alert(lang.echo("Connection was successful, but camera returned error"));
        } else {
          if (platform.includes("win32")) {
            exec('taskkill /F /IM liveView.exe');
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview stopped")
            };
            new Notification(lang.echo("Live preview deactivated"), alert);
          } else if (platform.includes("darwin")) {
            exec('killall -9 liveView');
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview stopped")
            };
            new Notification(lang.echo("Live preview deactivated"), alert);
          } else if (platform.includes("linux")) {
            if (process.arch == "x64") {
              exec('killall -9 liveView');
              exec('killall -15 hydra-x64');
            } else {
              exec('killall -9 liveView');
              exec('killall -15 hydra-x32');
            }
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview stopped")
            };
            new Notification(lang.echo("Live preview process terminated"), alert);
          }
        }
      } catch (e) {
        if (e) {
          alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
        }
      }
    });
  },
  receiveEvent: function () {
    const options = {
      uri: settings.cameraUrl,
      body: { "method": "receiveEvent", "params": [true], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      console.log(body);
    });
  },
  startMovieRec: function () {
    setShootMode("movie");
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: { "method": "startMovieRec", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    setTimeout(function () {
      request(options, function (error, response, body) {
        try {
          if (typeof body.result == 'undefined') {
            alert(lang.echo("Connection was successful, but camera returned error\nIt might be something prevents camera from going into movie mode\nTry to increase shooting response"));
          } else {
            const alert = {
              icon: iconPath,
              body: lang.echo("Check for REC on camera")
            };
            new Notification(lang.echo("Recording has started"), alert);
          }
        } catch (e) {
          if (e) {
            alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
          }
        }
      });
    }, settings.recMovieResponse);
  },
  stopMovieRec: function () {
    const options = {
      uri: settings.cameraUrl,
      timeout: settings.connectionTimeout,
      body: { "method": "stopMovieRec", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      try {
        if (typeof body.result == 'undefined') {
          alert(lang.echo("Connection was successful, but camera returned error\nIt might be something prevents camera from going into movie mode\nTry to increase shooting response"));
        } else {
          const alert = {
            icon: iconPath,
            body: lang.echo("Check for standby on camera")
          };
          new Notification(lang.echo("Recording was stopped"), alert);
        }
      } catch (e) {
        if (e) {
          alert(lang.echo("Connection timeout.\nCheck Wi-Fi connection and/or Camera URL settings"));
        }
      }
    });
  }
};