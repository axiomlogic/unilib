module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testMatch: ['<rootDir>/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
