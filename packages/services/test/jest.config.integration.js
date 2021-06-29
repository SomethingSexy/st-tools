module.exports = {
  testPathIgnorePatterns: ['test/integration/connection.ts'],
  setupFiles: ['dotenv/config'],
  testMatch: ['**/test/integration/**/*.+(ts)'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest']
  }
};
