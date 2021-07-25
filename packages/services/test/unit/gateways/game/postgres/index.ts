import { chain, done, fork, map } from 'fluture';
import { createGame, getGame, hasGame } from '../../../../../src/gateways/game/postgres/index.js';
import { Game } from '../../../../../src/entities/game.js';
import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { createClass } from '../../../../../src/gateways/game/postgres/class.js';
import { expect } from 'chai';
import { setupDatabase } from '../../../../setup.js';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert and update a game', (done) => {
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

test('should successfully retrieve a game', (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((gameResult) =>
        createClass(knex)(
          S.Right({
            description: 'Snob.',
            name: 'Toreador',
            gameId: gameResult.id
          })
        ).pipe(map(() => gameResult))
      )
    )
    .pipe(chain((gameResult) => getGame(knex)({ id: gameResult.id })));

  fork(done)((gameResult: Game) => {
    expect(gameResult.id).to.be.a('string');
    expect(gameResult.name).to.equal('VtM');
    expect(gameResult.classes.length).to.equal(1);
    expect(gameResult.classes[0].gameId).to.equal(gameResult.id);
    expect(gameResult.classes[0].name).to.equal('Toreador');
    expect(gameResult.classes[0].description).to.equal('Snob.');
    done();
  })(toRun);
});

test('should successfully return true that a game exists', (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((gameResult) =>
        createClass(knex)(
          S.Right({
            description: 'Snob.',
            name: 'Toreador',
            gameId: gameResult.id
          })
        ).pipe(map(() => gameResult))
      )
    )
    .pipe(chain((gameResult) => hasGame(knex)({ id: gameResult.id })));

  fork(done)((result) => {
    expect(result).to.equal(true);
    done();
  })(toRun);
});

test('should successfully return true that a game exists', (done) => {
  const toRun = hasGame(knex)({ id: 'b7c782ad-addd-46ea-aa9e-e46424eba2fb' });

  fork(done)((result) => {
    expect(result).to.equal(false);
    done();
  })(toRun);
});
