# Chittr API

## Description

Chittr is a repo for a twitter clone react native application

## Setting up the Server

1. Unzip the Chittr Server file and save the folder somewhere where you can easily access it.

2. Open the terminal and navigate to where you just saved the folder.

3. Run the code below. You may have to run it twice.

```bash
npm install
```

4. Then, in the terminal, run the following code. It should start up the server, telling you that it is listening on port 3333.

```bash
npm start
```

5. To check the server is working, open a another terminal window and navigate to the same directory, and run the code below.

```bash
npm test
```

## Setting up the Chittr App

1. Unzip the Chittr file and save the folder.

2. Open the terminal and go to the Chittr folder, entering the following code:

```bash
npm install @react-navigation/native @react-navigation/stack
```

```bash
npm install --save react-native-geocoding
```

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```


3. Use Android Studio to open "./Chittr/android".

```bash
https://developer.android.com/studio/run/managing-avds
```

4. Test you can run the AVD by clicking the green triangle button next to the listed AVD.


5. Open a another terminal navigating to the Chittr folder and run the code below:

```bash
npx react-native run-android
```

## Location Services

The code requires a valid Geocoding service API Key for it run efficiently
