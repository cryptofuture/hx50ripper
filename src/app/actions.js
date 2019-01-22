const request = require("request");
var gui = window.require('nw.gui');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const platform = os.platform();

if (platform.includes("win32")) {
  var hxripper = process.env.APPDATA + '\\hxripper';
  var configFolderHome = hxripper + '\\config';
  var settingsFile = configFolderHome + '\\settings.json';
} else if (platform.includes("darwin")) {
  var hxripper = process.env.HOME + '/Library/hxripper';
  var configFolderHome = hxripper + '/config';
  var settingsFile = configFolderHome + '/settings.json';
} else if (platform.includes("linux")) {
  var hxripper = process.env.HOME + "/.hxripper";
  var configFolderHome = hxripper + '/config';
  var settingsFile = configFolderHome + '/settings.json';
}

const lang = require('../app/lang');
const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
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
    if (platform.includes("win32")) {
      var homeFolder = process.env.APPDATA;
    } else {
      var homeFolder = process.env.HOME;
    }
    if (settings.savePictureLocation == "") {
      var savePicLocation = path.normalize(homeFolder + '/') + (new Date().toISOString() + '.jpg').split(':').join('-');
    } else {
      var savePicLocation = path.normalize(settings.savePictureLocation + '/') + (new Date().toISOString() + '.jpg').split(':').join('-');
    }
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
            if (process.arch == "x64") {
              require('child_process').exec(nw.__dirname + '/bin/hydra-x64 --primary-res 640x480');
            } else {
              require('child_process').exec(nw.__dirname + '/bin/hydra-x32 --primary-res 640x480');
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
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview stopped")
            };
            new Notification(lang.echo("Live preview deactivated"), alert);
          } else if (platform.includes("darwin")) {
            const alert = {
              icon: iconPath,
              body: lang.echo("Live preview stopped")
            };
            new Notification(lang.echo("Live preview deactivated"), alert);
          } else if (platform.includes("linux")) {
            var killAll = require('child_process');
            if (process.arch == "x64") {
              killAll.exec('killall -15 hydra-x64');
            } else {
              killAll.exec('killall -15 hydra-x32');
            }
            const alert = {
              icon: iconPath,
              body: lang.echo("hydra was terminated")
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