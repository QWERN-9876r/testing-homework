module.exports = {
    sets: {
        desktop: {
            files: 'example.hermione.js'
        }
    },

    browsers: {
        chrome: {
            automationProtocol: 'devtools',
            desiredCapabilities: {
                browserName: 'chrome',
            },
            windowSize: {
                width: 1920,
                heigth: 1080
            }
        },
    }
};