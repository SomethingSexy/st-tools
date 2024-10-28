# README

Note: The services in this project are being replaced by https://github.com/SomethingSexy/chronicle. This will still be used for the Discord bot logic.

Use this to maintain service versions
https://github.com/pmowrer/semantic-release-monorepo

## Linting

```
  "eslint.workingDirectories": [
    "./services/chroncile"
  ]
```

## Running

Startup docker
`docker-compose up`

Startup and build all services
`docker-compose up --build`

Startup and build a specific service
`docker-compose up --build <service>`
`docker-compose up --build chroncile`

Cleaning up volumes for integration testing
`docker volume ls`
`docker volume remove <volume_name>`
You will also need to remove the local database on your machine, st-tools/pgdata

## Tools

### Install

`npm ci`

To install services

`npm run bootstrap`

### Tests

To run all tests
`npm test`
