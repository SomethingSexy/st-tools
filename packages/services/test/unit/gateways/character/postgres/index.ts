import { createCharacter, updateCharacter } from '../../../../../src/gateways/character/postgres/index.js';
import { expect } from 'chai';
import { fork } from 'fluture';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { Knex } from 'knex';
import { createChronicle } from '../../../../../src/gateways/chronicle/postgres/index.js';
import { setupDatabase } from '../../../../setup.js';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert and update the character', async (done) => {
  fork(done)((chronicleResult) => {
    fork(done)((result) => {
      fork(done)((result) => {
        expect(result).to.not.be.an('undefined');
        done();
      })(
        updateCharacter(knex)(
          S.Right({
            id: result.id,
            name: 'Foo Updated',
            splat: 'vampire'
          })
        )
      );
    })(
      createCharacter(knex)(
        S.Right({
          name: 'Foo',
          splat: 'vampire',
          referenceType: 'discord',
          chronicleId: chronicleResult.id
        })
      )
    );
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
