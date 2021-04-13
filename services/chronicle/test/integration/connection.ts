import { databaseManagerFactory } from 'knex-db-manager';

export const config = {
  knex: {
    client: 'pg',
    searchPath: ['knex', 'public'],
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'db_test',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    }
  },
  dbManager: {
    superUser: process.env.POSTGRES_USER,
    superPassword: process.env.POSTGRES_PASSWORD
  }
};

export const connection = databaseManagerFactory(config).knexInstance();
