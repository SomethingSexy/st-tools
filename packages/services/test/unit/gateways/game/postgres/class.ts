import { chain, fork } from 'fluture';
import { createClass, getClass } from '../../../../../src/gateways/game/postgres/class';
import { Game } from '../../../../../src/entities/game';
import { GameClass } from '../../../../../src/entities/class';
import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { createGame } from '../../../../../src/gateways/game/postgres';
import { expect } from 'chai';
import { setupDatabase } from '../../../../setup';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert a class', async (done) => {
  fork(done)((gameResult: Game) => {
    fork(done)((classResult: GameClass) => {
      expect(classResult.id).to.be.a('string');
      expect(classResult.name).to.equal('Ventrue');
      expect(classResult.description).to.equal('Rich assholes.');
      // @ts-expect-error date
      expect(classResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
      // @ts-expect-error date
      expect(classResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
      done();
    })(
      createClass(knex)(
        S.Right({
          description: 'Rich assholes.',
          name: 'Ventrue',
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

test('it should successfully get a class', (done) => {
  const run = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((gameResult) =>
        createClass(knex)(
          S.Right({
            description: 'Rich assholes.',
            name: 'Ventrue',
            gameId: gameResult.id
          })
        )
      )
    )
    .pipe(
      chain((classResult) =>
        getClass(knex)({
          id: classResult.id
        })
      )
    );

  fork(done)((classResult: GameClass) => {
    expect(classResult.id).to.be.a('string');
    expect(classResult.name).to.equal('Ventrue');
    expect(classResult.description).to.equal('Rich assholes.');
    // @ts-expect-error date
    expect(classResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(classResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(run);
});
