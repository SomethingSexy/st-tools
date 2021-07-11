import { expect } from 'chai';
import { fork } from 'fluture';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { Knex } from 'knex';
import { createGame } from '../../../../../src/gateways/game/postgres/index.js';
import { setupDatabase } from '../../../../setup.js';
import { Game } from '../../../../../src/entities/game.js';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert and update a game', async (done) => {
  fork(done)((gameResult: Game) => {
    expect(gameResult.id).to.be.a('string');
    expect(gameResult.name).to.equal('VtM');
    done();
  })(
    createGame(knex)(
      S.Right({
        name: 'VtM',
        version: 'v5'
      })
    )
  );
});
