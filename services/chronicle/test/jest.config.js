module.exports = {
  "setupFiles": [
    "dotenv/config"
  ],
  "testMatch": [
    "**/test/unit/**/*.+(ts)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}