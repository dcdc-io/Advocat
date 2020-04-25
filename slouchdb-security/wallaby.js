module.exports = function(wallaby) {
    return {
        files: [
            'lib.ts',
        ],
        tests: [
            'lib.test.ts'
        ],
        env: {
            type: "node"
        },
        testFramework: "jest"
    };
}