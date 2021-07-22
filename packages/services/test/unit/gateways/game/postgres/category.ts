import { chain, fork } from 'fluture';
import { GameCategory } from '../../../../../src/entities/category.js';
import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary.js';
import { createAttributeCategory } from '../../../../../src/gateways/game/postgres/category.js';
import { createGame } from '../../../../../src/gateways/game/postgres/index.js';
import { expect } from 'chai';
import { setupDatabase } from '../../../../setup.js';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert an attribute category', (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  ).pipe(
    chain((gameResult) =>
      createAttributeCategory(knex)(
        S.Right({
          name: 'Mental',
          description: 'Mental skills',
          gameId: gameResult.id
        })
      )
    )
  );
  fork(done)((result: GameCategory) => {
    expect(result.id).to.be.a('string');
    expect(result.name).to.equal('Mental');
    expect(result.description).to.equal('Mental skills');
    // @ts-expect-error date
    expect(result.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(result.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(toRun);
});
