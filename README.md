**Quick Start**

- npm i
- cd ios && pod install

For running on devices use:
- react-native run-ios
- react-native run-android
- 

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [React Native](https://facebook.github.io/react-native/docs/getting-started.html) (Getting Started -> Building Projects with Native Code)
* [Android Studio](https://developer.android.com/studio/index.html) (for Android development)
* [XCode](https://itunes.apple.com/app/xcode/id497799835) (for iOS development)

## Installation
* `git clone git@ssh.hub.teamvoy.com:mein-object/mobile.git mo-mobile`

* `cd mo-mobile && npm install`
* 
## Running
### Android
Connect Android device via USB, where Android debugging bridge (ADB) is enabled. Run next command in terminal:

`adb devices`

If you see message, such

`0427c24722390aa3	device`

your device connected successfully. If you see next message:

`List of devices attacheed`

please, check is ADB enabled or check your USB connection.

Then run following command: `react-native run-android`

#### Possible problems
##### Could not connect to development server
Solution:
* Find out your desktop IP address (you can run following command in terminal: `ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`)
* `npm start`
* Shake phone
* Select `Dev Settings`
* Select `Debug server host & port for device`
* Type there your ip address and port `8081` (for example: `192.168.1.123:8081`) and apply changes.
* Shake device and reload.

### iOS
Before building and running project, run next in terminal:
`cd ios && pod install`

#### Running on Simulator
Run following command in terminal: `react-native run-ios`

#### Running on device
* Open `ios/MeinObjekt.xcworkspace` file in XCode
* Select device where you want run MOCA app
* Press on "Run" button