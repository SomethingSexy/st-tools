// Update with your config settings.
export default {
  development: {
    client: "pg",
    connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db/db_development`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  staging: {
    client: "pg",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      ext: 'ts'
    }
  },
  production: {
    client: "pg",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      ext: 'ts'
    }
  }
};
