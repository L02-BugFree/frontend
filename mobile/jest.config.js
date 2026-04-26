module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "clover"],
  coverageThreshold: {
    global: {
      lines: 70,
    },
  },
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Test Report",
      "outputPath": "./test-report/index.html"
    }]
  ],
  moduleNameMapper: {
    "^nativewind$": "<rootDir>/__mocks__/nativewind.js",
    "^nativewind/(.*)$": "<rootDir>/__mocks__/nativewind.js",
    "^react-native-reanimated$": require.resolve("react-native-reanimated/mock"),
    "^expo/src/winter$": "<rootDir>/__mocks__/emptyMock.js",
    "^expo/src/winter/(.*)$": "<rootDir>/__mocks__/emptyMock.js",
    "^@ungap/structured-clone$": "<rootDir>/__mocks__/structuredClone.js"
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ]
};
