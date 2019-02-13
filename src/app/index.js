const os = require('os');
const platform = os.platform();
const fs = require('fs-extra');
const path = require('path');
const gui = window.require('nw.gui');

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

if (!fs.existsSync(hxripper)) fs.mkdirSync(hxripper);
if (!fs.existsSync(configFolderHome)) fs.mkdirSync(configFolderHome);
if (!fs.existsSync(settingsFile)) fs.copySync(path.normalize(nw.__dirname + '/app/settings.json'), settingsFile);

const actions = require('../app/actions');
const prefs = require('../app/prefs');
const lang = require('../app/lang');

function echo(phrase) {
    document.write(lang.echo(phrase));
}

const menu = new nw.Menu({
    type: 'menubar'
});

if (platform.includes("darwin")) {
    menu.createMacBuiltin('HX50 Photo Ripper', {
        hideEdit: false,
        hideWindow: true
    });
}

let mSLP = lang.echo('Start Live Preview');
let mHydra = lang.echo('Start Live Preview via Hydra');
let mFLP = lang.echo('Stop Live Preview');
let mQuit = lang.echo('Quit');
let mPreview = lang.echo('Preview');
let mSRec = lang.echo('Start Recording');
let mFRec = lang.echo('Stop Recording');
let mRecording = lang.echo('Recording');
let mTP = lang.echo('Take Picture');
let mPhoto = lang.echo('Photo');
let mEng = lang.echo('Change Language: English');
let mRus = lang.echo('Change Language: Russian');
let mSR = lang.echo('Configure Shooting Response');
let mRR = lang.echo('Configure Recording Response');
let mTimeout = lang.echo('Configure Request Timeout');
let mSCURL = lang.echo('Set Camera URL');
let mliveView = lang.echo('Set Live Preview URL');
let mISC = lang.echo('Image Saving Configuration');
let mSettings = lang.echo('Settings');
let mCGHI = lang.echo('Create New GitHub Issue');
let mHIW = lang.echo('How It Works');
let mDonate = lang.echo('Donate');
let mHelp = lang.echo('Help');

const preview = new nw.Menu();
preview.append(new nw.MenuItem({
    label: mSLP,
    key: 'p',
    modifiers: 'ctrl',
    click: function () {
        actions.startLive();
    }
}));
if (platform.includes("linux")) {
    preview.append(new nw.MenuItem({
        label: mHydra,
        click: function () {
            actions.startLiveHydra();
        }
    }));
} else {
}
preview.append(new nw.MenuItem({
    label: mFLP,
    key: 'l',
    modifiers: 'ctrl',
    click: function () {
        actions.stopLive();
    }
}));
preview.append(new nw.MenuItem({
    type: 'separator'
}));
preview.append(new nw.MenuItem({
    label: mQuit,
    key: 'q',
    modifiers: 'ctrl',
    click: function () {
        require('process').exit(0);
    }
}));
menu.append(new nw.MenuItem({
    label: mPreview,
    submenu: preview
}));

const recording = new nw.Menu();
recording.append(new nw.MenuItem({
    label: mSRec,
    key: 'r',
    modifiers: 'ctrl',
    click: function () {
        actions.startMovieRec();
    }
}));
recording.append(new nw.MenuItem({
    label: mFRec,
    key: 't',
    modifiers: 'ctrl',
    click: function () {
        actions.stopMovieRec();
    }
}));
menu.append(new nw.MenuItem({
    label: mRecording,
    submenu: recording
}));

const photo = new nw.Menu();
photo.append(new nw.MenuItem({
    label: mTP,
    key: 'f',
    modifiers: 'ctrl',
    click: function () {
        actions.actTakePicture();
    }
}));
menu.append(new nw.MenuItem({
    label: mPhoto,
    submenu: photo
}));

const settings = new nw.Menu();
settings.append(new nw.MenuItem({
    label: mEng,
    click: function () {
        lang.changeLanguage("en");
    }
}));
settings.append(new nw.MenuItem({
    label: mRus,
    click: function () {
        lang.changeLanguage("ru");
    }
}));
settings.append(new nw.MenuItem({
    label: mSR,
    click: function () {
        prefs.shootingResponseWindow();
    }
}));
settings.append(new nw.MenuItem({
    label: mRR,
    click: function () {
        prefs.recResponseWindow();
    }
}));
settings.append(new nw.MenuItem({
    label: mTimeout,
    click: function () {
        prefs.reqTimeOutWindow();
    }
}));
settings.append(new nw.MenuItem({
    label: mSCURL,
    click: function () {
        prefs.cameraUrlWindow();
    }
}));
settings.append(new nw.MenuItem({
    label: mliveView,
    click: function () {
        prefs.liveViewUrlWindow();
    }
}));
settings.append(new nw.MenuItem({
    label: mISC,
    click: function () {
        prefs.savePictureWindow();
    }
}));
menu.append(new nw.MenuItem({
    label: mSettings,
    submenu: settings
}));

const help = new nw.Menu();

if (platform.includes("darwin")) {
    help.append(new nw.MenuItem({
        label: mCGHI,
        click: function () {
            gui.Window.open('https://github.com/cryptofuture/hx50ripper/issues/new', {
                position: 'center',
                width: 800,
                height: 600
            });
        }
    }));
    help.append(new nw.MenuItem({
        type: 'separator'
    }));
    help.append(new nw.MenuItem({
        label: mHIW,
        click: function () {
            gui.Window.open('https://github.com/cryptofuture/hx50ripper#how-it-works', {
                position: 'center',
                width: 800,
                height: 600
            });
        }
    }));
    help.append(new nw.MenuItem({
        label: mDonate,
        click: function () {
            gui.Window.open('https://github.com/cryptofuture/hx50ripper#donation', {
                position: 'center',
                width: 800,
                height: 600
            });
        }
    }));
} else {
    help.append(new nw.MenuItem({
        label: mCGHI,
        click: function () {
            gui.Shell.openExternal('https://github.com/cryptofuture/hx50ripper/issues/new');
        }
    }));
    help.append(new nw.MenuItem({
        type: 'separator'
    }));
    help.append(new nw.MenuItem({
        label: mHIW,
        click: function () {
            gui.Shell.openExternal('https://github.com/cryptofuture/hx50ripper#how-it-works');
        }
    }));
    help.append(new nw.MenuItem({
        label: mDonate,
        click: function () {
            gui.Shell.openExternal('https://github.com/cryptofuture/hx50ripper#donation');
        }
    }));
}

menu.append(new nw.MenuItem({
    label: mHelp,
    submenu: help
}));

nw.Window.get().menu = menu;
global.hxripper = nw.Window.get();