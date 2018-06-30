@ECHO off

MOVE /Y platforms\android\app\build\outputs\apk\debug\app-debug.apk app.apk

RMDIR /S /Q platforms\android\build\android-profile
RMDIR /S /Q platforms\android\app\build\outputs
