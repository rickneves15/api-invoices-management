const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('./tsconfig.json')

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // preset: 'ts-jest',
  rootDir: './',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/e2e/'],
  testTimeout: 30000,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
}
