export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/*.spec.js',
        '!src/server.js',
    ],
    coverageDirectory: 'coverage',
    verbose: true,
};
