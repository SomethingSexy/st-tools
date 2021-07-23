import { chain, fork } from 'fluture';
import { createAttribute, getAttribute } from '../../../../../src/gateways/game/postgres/attribute';
import { GameAttribute } from '../../../../../src/entities/attribute';
import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { createAttributeCategory } from '../../../../../src/gateways/game/postgres/category';
import { createGame } from '../../../../../src/gateways/game/postgres';
import { expect } from 'chai';
import { setupDatabase } from '../../../../setup';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert an attribute', async (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((result) =>
        createAttributeCategory(knex)(
          S.Right({
            name: 'Mental',
            description: 'Mental attributes.',
            gameId: result.id
          })
        )
      )
    )
    .pipe(
      chain((result) =>
        createAttribute(knex)(
          S.Right({
            description: 'How smart you are.',
            name: 'Intelligence',
            max: 5,
            min: 0,
            categoryId: result.id,
            gameId: result.gameId
          })
        )
      )
    );

  fork(done)((attributeResult: GameAttribute) => {
    expect(attributeResult.id).to.be.a('string');
    expect(attributeResult.name).to.equal('Intelligence');
    expect(attributeResult.description).to.equal('How smart you are.');
    expect(attributeResult.max).to.equal(5);
    expect(attributeResult.min).to.equal(0);
    expect(attributeResult.gameId).to.be.a('string');
    expect(attributeResult.categoryId).to.be.a('string');
    // @ts-expect-error date
    expect(attributeResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(attributeResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(toRun);
});

test('it should successfully get an attribute', (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((result) =>
        createAttributeCategory(knex)(
          S.Right({
            name: 'Mental',
            description: 'Mental attributes.',
            gameId: result.id
          })
        )
      )
    )
    .pipe(
      chain((result) =>
        createAttribute(knex)(
          S.Right({
            description: 'How smart you are.',
            name: 'Intelligence',
            max: 5,
            min: 0,
            categoryId: result.id,
            gameId: result.gameId
          })
        )
      )
    )
    .pipe(chain((result) => getAttribute(knex)({ id: result.id })));

  fork(done)((attributeResult: GameAttribute) => {
    expect(attributeResult.id).to.be.a('string');
    expect(attributeResult.name).to.equal('Intelligence');
    expect(attributeResult.description).to.equal('How smart you are.');
    expect(attributeResult.max).to.equal(5);
    expect(attributeResult.min).to.equal(0);
    expect(attributeResult.gameId).to.be.a('string');
    expect(attributeResult.categoryId).to.be.a('string');
    // @ts-expect-error date
    expect(attributeResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(attributeResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(toRun);
});
