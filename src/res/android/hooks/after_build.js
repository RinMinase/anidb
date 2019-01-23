const { join } = require("path");
const {
	readdir,
	unlink,
	existsSync,
	mkdirSync,
	createReadStream,
	createWriteStream,
} = require("fs");

module.exports = (context) => {
	const ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
	const config = new ConfigParser("config.xml");

	const dir = "./build";
	const buildLogDir = "platforms/android/build/android-profile";

	const apkLocation = "platforms/android/app/build/outputs/apk/debug";
	const apkFilename = "app-debug.apk";

	const apkOutput = "build";
	const apkOutputFilename = `${config.packageName()}_${config.version()}.apk`;

	readdir(buildLogDir, (err, files) => {
		if (err) {
			throw err;
		}

		for (const file of files) {
			unlink(join(buildLogDir, file), (unlinkErr) => {
				if (unlinkErr) {
					throw unlinkErr;
				}
			});
		}
	});

	if (!existsSync(dir)){
		mkdirSync(dir);
	}

	createReadStream(join(apkLocation, apkFilename))
		.pipe(createWriteStream(join(apkOutput, apkOutputFilename)));
};
