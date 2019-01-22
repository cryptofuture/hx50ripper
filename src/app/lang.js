const fs = require('fs-extra');
const os = require('os');
const path = require('path');
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

const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));

module.exports = {
    echo: function (phrase) {
        var locales = path.normalize(nw.__dirname + '/locales');
        var y18n = require('y18n')({
            updateFiles: false,
            directory: locales,
            locale: settings.locale,
            fallbackToLanguage: "en"
        });
        return y18n.__(phrase + "");
    },
    changeLanguage: function (locale) {
        settings.locale = locale;
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
        global.hxripper.reloadIgnoringCache();
    }
};