import knex from 'knex';

export const getConnection = () =>
  knex({
    client: 'pg',
    searchPath: ['knex', 'public'],
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'db_development',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    }
  });
