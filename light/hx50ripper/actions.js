const request = require("request");
fs = require('fs');
const settings = JSON.parse(fs.readFileSync(process.cwd() + '/settings.js', 'utf-8'));
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
    console.log("Shoot mode is now: " + mode);
  });
}
module.exports = {
  actTakePicture: function () {
    setShootMode("still");
    const options = {
      uri: settings.cameraUrl,
      body: {
        "method": "actTakePicture", "params": [], "id": id(), "version": "1.0"
      },
      method: 'POST',
      json: true
    };
    setTimeout(function () {
      request(options, function (error, response, body) {
        // It looks like it supports set of photos here
        //console.log(body);
        //photo = body.result[0];
        //console.log(photo[0]);
        console.log(body);
      });
    }, settings.takePictureResponse);
  },
  startLive: function () {
    const options = {
      uri: settings.cameraUrl,
      body: { "method": "startLiveview", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      photo = body.result[0];
      console.log(photo);
    });
  },
  stopLive: function () {
    const options = {
      uri: settings.cameraUrl,
      body: { "method": "stopLiveview", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      console.log(body);
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
      body: { "method": "startMovieRec", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    setTimeout(function () {
      request(options, function (error, response, body) {
        console.log(body);
      });
    }, settings.recMovieResponse);
  },
  stopMovieRec: function () {
    const options = {
      uri: settings.cameraUrl,
      body: { "method": "stopMovieRec", "params": [], "id": id(), "version": "1.0" },
      method: 'POST',
      json: true
    };
    request(options, function (error, response, body) {
      console.log(body);
    });
  }
};
