import knex from 'knex';

export const getConnection = () =>
  knex({
    client: 'pg',
    searchPath: ['knex', 'public'],
    connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db/db_development`
  });
