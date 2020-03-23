module.exports = {
    testPathIgnorePatterns :["/node_modules/", "/cypress/"],
    transform: {
      '^.+\\.svelte$': 'svelte-jester',
      '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'svelte'],
  }