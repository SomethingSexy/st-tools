import { createCharacter, updateCharacter } from '../../../../../src/gateways/character/postgres/index.js';
import { expect } from 'chai';
import { fork } from 'fluture';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { S } from '../../../../../src/utils/sanctuary';
import { up as upCharacter } from '../../../../../migrations/20210628160543_create_characters_table';
import { up as upChronicle } from '../../../../../migrations/20210628160534_create_chronicles_table';
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
      implementation: v4,
      impure: true,
    });
  });

  knex = await database.adapters.createKnex() as import('knex');

  await upChronicle(knex);
  await upCharacter(knex);
})


test('should successfully insert and update the character', async (done) => {

  fork(done)(chronicleResult => {
    fork(done)((result) => {
      fork(done)((result) => {
        expect(result).to.not.be.an('undefined');
        done();
      })(
        updateCharacter(knex)(S.Right({
          id:  result.id,
          name: 'Foo Updated',
          splat: 'vampire'
        }))
      );
    })(
      createCharacter(knex)(S.Right({
        name: 'Foo',
        splat: 'vampire',
        referenceType: 'discord',
        chronicleId: chronicleResult.id
      }))
    )
  })(
    createChronicle(knex)(S.Right({
      name: 'My Chronicle',
      referenceType: 'discord',
      referenceId: '123',
      game: 'vtm',
      version: 'v5'
    }))
  )
})
