export default {
  "resolver": "jest-ts-webcompat-resolver",
  "setupFiles": [
    "dotenv/config"
  ],
  "testMatch": [
    "**/test/**/*.+(ts)"
  ],
  "transform": {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest'],
  }
}