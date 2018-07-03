/* eslint-disable */

var fs = require("fs");
var path = require("path")
var ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
var config = new ConfigParser("config.xml");

var dir = "./build"

var apkLocation = "platforms/android/app/build/outputs/apk/debug";
var apkFilename = "app-debug.apk";

var apkOutput = "build";
var apkOutputFilename = config.id() + "_" + config.version() + ".apk"

if (!fs.existsSync(dir)){
	fs.unlinkSync(dir);
	fs.mkdirSync(dir);
}

fs.createReadStream(path.join(apkLocation, apkFilename))
	.pipe(fs.createWriteStream(path.join(apkOutput, apkOutputFilename)));
