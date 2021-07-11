import chai, { expect } from 'chai';
import { fork, race } from 'fluture';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { Knex } from 'knex';
import { createRace } from '../../../../../src/gateways/game/postgres/race';
import { setupDatabase } from '../../../../setup';
import { GameRace } from '../../../../../src/entities/race';
import { Game } from '../../../../../src/entities/game';
import { createGame } from '../../../../../src/gateways/game/postgres';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert and update a race', async (done) => {
  fork(done)((gameResult: Game) => {
    fork(done)((raceResult: GameRace) => {
      expect(raceResult.id).to.be.a('string');
      expect(raceResult.name).to.equal('Vampire');
      expect(raceResult.description).to.equal('Blood sucker');
      expect(raceResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
      expect(raceResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
      done();
    })(
      createRace(knex)(
        S.Right({
          description: 'Blood sucker',
          name: 'Vampire',
          gameId: gameResult.id
        })
      )
    )
  })(
    createGame(knex)(
      S.Right({
        name: 'VtM',
        version: 'v5'
      })
    )
  );
});
