// eslint-disable-next-line import/no-commonjs
module.exports = {
    project: {
      ios: {},
      android: {}, // grouped into "project"
    },
    dependencies: {
      realm: {
        platforms: {
          ios: null // disable iOS platform, other platforms will still autolink if provided
        }
      },
      "react-native-tensorflow": {
        platforms: {
          ios: null
        }
      }
    },
    assets: ["src/assets/fonts"], // stays the same
  };