const gui = window.require('nw.gui');
const fs = require('fs-extra');
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

function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
}

module.exports = {
    setCameraUrl: function () {
        settings.cameraUrl = global.cameraUrl;
        if (global.cameraUrl.startsWith("http")) {
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
            alert(lang.echo("Camera URL is: ") + global.cameraUrl);
        }
        else {
            alert(lang.echo("Doesn't look like valid Camera URL"));
        }
    },
    cameraUrlWindow: function () {
        gui.Window.open('views/cameraUrl.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    },
    showCurrentCameraUrl: function () {
        alert(settings.cameraUrl);
    },
    setCameraUrlDefault: function () {
        settings.cameraUrl = 'http://10.0.0.1:10000/camera';
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert(lang.echo("Camera URL is: ") + settings.cameraUrl + lang.echo(" (default)"));
    },
    setLiveViewUrl: function () {
        settings.liveViewUrl = global.liveViewUrl;
        if (global.liveViewUrl.startsWith("http")) {
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
            alert(lang.echo("Live Preview URL is: ") + global.liveViewUrl);
        }
        else {
            alert(lang.echo("Doesn't look like valid Live Preview URL"));
        }
    },
    liveViewUrlWindow: function () {
        gui.Window.open('views/liveViewUrl.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    },
    showCurrentLiveViewUrl: function () {
        alert(settings.liveViewUrl);
    },
    setLiveViewUrlDefault: function () {
        settings.liveViewUrl = 'http://10.0.0.1:60152';
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert(lang.echo("Live Preview URL is: ") + settings.liveViewUrl + lang.echo(" (default)"));
    },
    setShootingResponse: function () {
        settings.takePictureResponse = global.shootingResponse;
        if (isPositiveInteger(global.shootingResponse) == true) {
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
            alert(lang.echo("Shooting response is: ") + global.shootingResponse);
        }
        else {
            alert(lang.echo("Doesn't look like valid positive integer number"));
        }
    },
    shootingResponseWindow: function () {
        gui.Window.open('views/shootingResponse.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    },
    showCurrentShootingResponse: function () {
        alert(settings.takePictureResponse);
    },
    setShootingResponseDefault: function () {
        settings.takePictureResponse = 1200;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert(lang.echo("Shooting response is: ") + settings.takePictureResponse + lang.echo(" (default)"));
    },
    setRecResponse: function () {
        settings.recMovieResponse = global.recMovieResponse;
        if (isPositiveInteger(global.recMovieResponse) == true) {
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
            alert(lang.echo("Recording response is: ") + global.recMovieResponse);
        }
        else {
            alert(lang.echo("Doesn't look like valid positive integer number"));
        }
    },
    recResponseWindow: function () {
        gui.Window.open('views/recResponse.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    },
    showCurrentRecResponse: function () {
        alert(settings.recMovieResponse);
    },
    setRecResponseDefault: function () {
        settings.recMovieResponse = 1000;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert(lang.echo("Recording response is: ") + settings.recMovieResponse + lang.echo(" (default)"));
    },
    setReqTimeOut: function () {
        settings.connectionTimeout = global.connectionTimeout;
        if (isPositiveInteger(global.connectionTimeout) == true) {
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
            alert("Timeout: " + global.connectionTimeout);
        }
        else {
            alert(lang.echo("Doesn't look like valid positive integer number"));
        }
    },
    reqTimeOutWindow: function () {
        gui.Window.open('views/reqTimeout.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    },
    showCurrentReqTimeOut: function () {
        alert(settings.connectionTimeout);
    },
    setReqTimeOutDefault: function () {
        settings.connectionTimeout = 8000;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert("Timeout: " + settings.connectionTimeout + lang.echo(" (default)"));
    },
    savePicture: function (state) {
        settings.autoSavePicture = state;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        if (settings.autoSavePicture == true) {
            alert(lang.echo("Automatic image saving activated"));
        } else if (settings.autoSavePicture == false) {
            alert(lang.echo("Automatic image saving deactivated"));
        } else {
            alert(settings.autoSavePicture);
        }
    },
    savePictureLocationSelect: function () {
        global.hxripper.window.document.getElementById('savePictureLocation').click();
        global.hxripper.window.document.querySelector('#savePictureLocation').addEventListener("change", function () {
            settings.savePictureLocation = this.value;
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        });
    },
    savePictureCurrentLocation: function () {
        alert(settings.savePictureLocation);
    },
    setSavePictureDefaultLocation: function () {
        if (platform.includes("win32")) {
            var homeFolder = process.env.APPDATA;
        } else {
            var homeFolder = process.env.HOME;
        }
        settings.savePictureLocation = homeFolder;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        alert(lang.echo("Save Images Location is: ") + homeFolder);
    },
    savePictureWindow: function () {
        gui.Window.open('views/savePicture.html', {
            focus: true,
            position: 'center',
            width: 800,
            height: 600
        });
    }
};