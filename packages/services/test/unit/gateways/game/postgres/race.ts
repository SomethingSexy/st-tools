import { expect } from 'chai';
import { chain, fork, FutureInstance, map, race } from 'fluture';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { Knex } from 'knex';
import { createRace, linkClassToRace, unlinkClassFromRace } from '../../../../../src/gateways/game/postgres/race';
import { setupDatabase } from '../../../../setup';
import { GameRace } from '../../../../../src/entities/race';
import { Game } from '../../../../../src/entities/game';
import { createGame } from '../../../../../src/gateways/game/postgres';
import { createClass } from '../../../../../src/gateways/game/postgres/class';

let knex: Knex;
let createLink: FutureInstance<string, {
  id: string;
  classId: string;
  raceId: string;
}>;

beforeEach(async () => {
  knex = await setupDatabase();
  createLink = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  ).pipe(
    chain((result) => {
      return createRace(knex)(
        S.Right({
          description: 'Blood sucker',
          name: 'Vampire',
          gameId: result.id
        })
      ).pipe(
        map(r => ({
          gameId: result.id,
          raceId: r.id
        }))
      )
    }
  ))
  .pipe(
    chain(result => {
      return createClass(knex)(
        S.Right({
          description: 'Rich assholes.',
          name: 'Ventrue',
          gameId: result.gameId
        })
      ).pipe(
        map(r => ({
          ...result,
          classId: r.id
        }))
      )
    })
  ).pipe(
    chain(result => {
      return linkClassToRace(knex)(result)
    })
  );
});

test('should successfully insert and update a race', async (done) => {
  fork(done)((gameResult: Game) => {
    fork(done)((raceResult: GameRace) => {
      expect(raceResult.id).to.be.a('string');
      expect(raceResult.name).to.equal('Vampire');
      expect(raceResult.description).to.equal('Blood sucker');
      // @ts-expect-error date
      expect(raceResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
      // @ts-expect-error date
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
    );
  })(
    createGame(knex)(
      S.Right({
        name: 'VtM',
        version: 'v5'
      })
    )
  );
});

test('should link a class and race together', done => {
    fork(done)((raceResult: { id: string }) => {
      expect(raceResult.id).to.be.a('string');
      done();
    })(createLink);
})

test('should delete a link between a class and a race', done => {
  const deleteLink = createLink.pipe(
    chain(unlinkClassFromRace(knex))
  )

  fork(done)((raceResult: { classId: string; raceId: string }) => {
    expect(raceResult.classId).to.be.a('string');
    expect(raceResult.raceId).to.be.a('string');
    done();
  })(deleteLink);
})