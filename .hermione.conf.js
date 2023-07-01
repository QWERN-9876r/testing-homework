module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
      windowSize: {
        width: 1920,
        height: 1080
      },
      screenshotDelay: 50
    }
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
      path: 'hermione-html-report'
    },
  },
};
