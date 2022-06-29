# Name der Anwendung
App für „Ping! Die Museumsapp“


# Kurzbeschreibung
Dieses Repository beinhaltet die App für Ping! Die Museumsapp und ist Teil des entsprechenden Meta-Repositories: https://github.com/museum4punkt0/Ping-Die-Museumsapp


# Entstehungskontext 
Die native App auf Basis des React Native Frameworks ist entstanden im Verbundprojekt museum4punkt0 – Digitale Strategien für das Museum der Zukunft, Teilprojekt: Der humboldt’sche Raum im digitalen Raum.


# Förderung 
Das Projekt museum4punkt0 wird gefördert durch die Beauftragte der Bundesregierung für Kultur und Medien aufgrund eines Beschlusses des Deutschen Bundestages.

# Inhaltsverzeichnis
1. Name der Anwendung 
2. Kurzbeschreibung 
3. Entstehungskontext
4. Förderung
5. Inhaltsverzeichnis 
6. Technologiebeschreibung
7. Quick Start
8. Installation
9. Credits
10. Markenname
11. Lizenz 

# Technologiebeschreibung
Zur Benutzung werden Smartphones benötigt, die entweder über ein iOS oder ein Android Betriebssystem verfügen. Die Anwendung läuft ab folgenden Betriebssystemen: Android Oreo 8.0 und iOS 10.3.3.. Nach Veröffentlichung der App im Playstore bzw. Appstore kann die Anwendung von jedem/r SmartphonebesitzerIn heruntergeladen und installiert werden. 

# Quick Start

**iOS**
- npm i --legacy-peer-deps
- cd ios && pod install

For running use:
- react-native run-ios


**Android**
- npm i --legacy-peer-deps

For running use:
- react-native run-android --variant stageDebug

# Installation

## Prerequisites
You will need the following things properly installed on your computer:

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [React Native](https://facebook.github.io/react-native/docs/getting-started.html) (Getting Started -> Building Projects with Native Code)
* [Android Studio](https://developer.android.com/studio/index.html) (for Android development)
* [XCode](https://itunes.apple.com/app/xcode/id497799835) (for iOS development)

## Installation
* Clone the repo: `git clone https://github.com/museum4punkt0/Mein-Objekt-MOB-GPL.git`
* Enter inside of the project's directory: `cd mobile`
* Install dependencies: `npm i --legacy-peer-deps` (If first run results with an error - run this command for the second time)
* 
### For Android
* create a `local.properties` file in the project's path: `android/local.properties` containing this line: `sdk.dir = <path_to_your_android_sdk>`
* Download the debug keystore from this link (https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore) and put int in the `android/app/` directory


## Running

### Android

#### On the device
Connect Android device via USB, where Android debugging bridge (ADB) is enabled. Run next command in terminal:

`adb devices`

If you see message, such

`0427c24722390aa3	device`

your device connected successfully. If you see next message:

`List of devices attacheed`

please, check is ADB enabled or check your USB connection.

Then run following command in the root project's directory: `react-native run-android --variant stageDebug`
The App will be run against a Stage backend

#### In the emulator

Open the `/android` folder of this project in an `Android Studio`

Open up and `AVD Manager`: hit the Shift key two times and enter `AVD` in the prompt, then click on the `AVD Manager` option

Create a new Virtual Device or start an existing one

Ensure that you did everything correct by typing `adb device` in the console. You should get an output like:
`emulator-5554	device`

To run an project in the emulator:
`react-native run-android --variant stageDebug`
The App will be run against a Stage backend

## Possible problems

### Could not connect to development server

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

Run following command in terminal:
`react-native run-ios`

#### Running on device
* Open `ios/MeinObjekt.xcworkspace` file in XCode
* Select device where you want run app
* Press on "Run" button

# Credits 
Auftraggeber*in/Rechteinhaber*in 
Stiftung Humboldt Forum im Berliner Schloss 
Urheber*innen 
Humboldt-Universität zu Berlin, gamelab.berlin am Helmholtz-Zentrum für Kulturtechnik, Zentralinstitut der HU. 
Code und Dokumentation in diesem Repositorium wurden begutachtet durch TICE Software UG (haftungsbeschränkt) (https://tice.software/de/)


# Markenname 
„Ping! Die Museumsapp“ ist eine Marke der Stiftung Humboldt Forum im Berliner Schloss. Die Marke kann von anderen gemeinnützigen Körperschaften für Software genutzt werden, die auf dem veröffentlichten Code (Repositorium) basiert. In diesem Fall wird um Angabe des folgenden Nachweises gebeten:

    „Ping! Die Museumsapp“ ist eine Marke der Stiftung Humboldt Forum im Berliner Schloss.


# Lizenz 
Ping! Die Museumsapp Copyright © 2021 Stiftung Humboldt Forum im Berliner Schloss; entwickelt von Humboldt Innovation GmbH, Thomas Lilge, Christian Stein, im Rahmen des Verbundprojekts museum4punkt0, weiterentwickelt in Kooperation mit dem Badischen Landesmuseum im Rahmen des Projekts Creative Collections.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/museum4punkt0/Ping-APP-MIT/blob/master/LICENSE.md)
