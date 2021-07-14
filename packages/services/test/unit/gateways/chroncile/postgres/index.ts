import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { createChronicle } from '../../../../../src/gateways/chronicle/postgres/index.js';
import { expect } from 'chai';
import { fork } from 'fluture';
import { setupDatabase } from '../../../../setup.js';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
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
