import { expect } from 'chai';
import { fork } from 'fluture';
import { DataType, newDb } from 'pg-mem';
import { S } from '../../../../../src/utils/sanctuary';
import { up as upCharacter } from '../../../../../migrations/20210628160543_create_characters_table.js';
import { up as upChronicle } from '../../../../../migrations/20210628160534_create_chronicles_table.js';
import { beforeEach } from '@jest/globals';
import { Knex } from 'knex';
import { createChronicle } from '../../../../../src/gateways/chronicle/postgres/index.js';
import { v4 } from 'uuid';

let knex: Knex;

beforeEach(async () => {
  const database = newDb();

  database.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: () => v4(),
      impure: true
    });
  });

  // @ts-expect-error - import knex
  knex = (await database.adapters.createKnex()) as import('knex');

  // TODO: Figure out how to get this to work, issue with jest and swc maybe
  // await knex.migrate.latest();
  await upChronicle(knex);
  await upCharacter(knex);
});

test('should successfully insert and update the character', async (done) => {
  fork(done)((chronicleResult) => {
    expect(chronicleResult.id).to.be.a('string');
    done();
  })(
    createChronicle(knex)(
      S.Right({
        name: 'My Chronicle',
        referenceType: 'discord',
        referenceId: '123',
        game: 'vtm',
        version: 'v5'
      })
    )
  );
});
