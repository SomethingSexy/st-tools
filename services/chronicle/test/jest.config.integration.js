module.exports = {
  "testPathIgnorePatterns" : [
    "test/integration/connection.ts" 
  ],
  "setupFiles": [
    "dotenv/config"
  ],
  "testMatch": [
    "**/test/integration/**/*.+(ts)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}