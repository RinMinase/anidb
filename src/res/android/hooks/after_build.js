/* eslint-disable */

module.exports = function(context) {
	var fs = require("fs");
	var path = require("path")
	var ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
	var config = new ConfigParser("config.xml");

	var dir = "./build"
	var buildLogDir = "platforms/android/build/android-profile";

	var apkLocation = "platforms/android/app/build/outputs/apk/debug";
	var apkFilename = "app-debug.apk";

	var apkOutput = "build";
	var apkOutputFilename = config.packageName() + "_" + config.version() + ".apk"

	fs.readdir(buildLogDir, function (err, files) {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(buildLogDir, file), function(err) {
				if (err) throw err;
			});
		}
	});

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	fs.createReadStream(path.join(apkLocation, apkFilename))
		.pipe(fs.createWriteStream(path.join(apkOutput, apkOutputFilename)));
}
