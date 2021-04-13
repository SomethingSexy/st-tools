import { databaseManagerFactory } from 'knex-db-manager';
import { config, connection } from './integration/connection';

export const mochaHooks = {
  afterAll: () => {
    if (process.env.NODE_ENV === 'integration') {
      return connection
      // @ts-expect-error - types not aligned with knex and knex-db-manager
        .destroy()
        .then(() => databaseManagerFactory(config).dropDb())
        .then(() => console.log('afterAll complete'));
    }
  },
  beforeAll: () => {
    if (process.env.NODE_ENV === 'integration') {
      return databaseManagerFactory(config)
        .dropDb()
        .then(() => databaseManagerFactory(config).createDb())
        .then(() => console.log('beforeAll complete'));
    }
  }
};
