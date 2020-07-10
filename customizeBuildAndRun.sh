#!/bin/bash

INPUT1="dev"
#INPUT1="browser-dev"
#INPUT1="browser-prod"
#INPUT1="android"
#INPUT1="ios"


node adjustPackageJson.js --homepage $INPUT1
node adjustAPIkey.js --files "src/utils/apiKeys.js" --platform $INPUT1  # The files parameter can handle multiple filenames
node adjustRouterBasename.js --files "src/index.js" --platform $INPUT1
node adjustHtaccess.js --platform $INPUT1

case $INPUT1 in
  "dev")
    echo "Please run 'reco serve' to start the development server, if it's not started."
    ;;
  "browser-dev"|"browser-prod")
    npm run btc
    echo "cordova build browser...."
    cordova build browser
    echo "build complete"
    ;;
  "android")
    npm run btc
    echo "cordova run android...."
    cordova run android
    ;;
  "ios")
    npm run btc
    echo "cordova build ios...."
    cordova build ios
    echo "build completed"
    echo "please open Xcode to emulate or run"
    ;;
esac
