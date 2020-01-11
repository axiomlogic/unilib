module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testMatch: ['<rootDir>/*.test.ts', '<rootDir>/packages/**/*.test.ts']
  // globals: {
  //   'ts-jest': {
  //     tsConfig: './tsconfig.test.json'
  //   }
  // }
};
