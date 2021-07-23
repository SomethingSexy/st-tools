import { chain, fork } from 'fluture';
import { createSkill, getSkill } from '../../../../../src/gateways/game/postgres/skill';
import { GameSkill } from '../../../../../src/entities/skill';
import { Knex } from 'knex';
import { S } from '../../../../../src/utils/sanctuary';
import { beforeEach } from '@jest/globals';
import { createGame } from '../../../../../src/gateways/game/postgres';
import { createSkillCategory } from '../../../../../src/gateways/game/postgres/category';
import { expect } from 'chai';
import { setupDatabase } from '../../../../setup';

let knex: Knex;

beforeEach(async () => {
  knex = await setupDatabase();
});

test('should successfully insert an skill', async (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((result) =>
        createSkillCategory(knex)(
          S.Right({
            name: '',
            description: 'Mental skills.',
            gameId: result.id
          })
        )
      )
    )
    .pipe(
      chain((result) =>
        createSkill(knex)(
          S.Right({
            description: 'Your surroundings.',
            name: 'Awareness',
            max: 5,
            min: 0,
            categoryId: result.id,
            gameId: result.gameId
          })
        )
      )
    );

  fork(done)((skillResult: GameSkill) => {
    expect(skillResult.id).to.be.a('string');
    expect(skillResult.name).to.equal('Awareness');
    expect(skillResult.description).to.equal('Your surroundings.');
    expect(skillResult.max).to.equal(5);
    expect(skillResult.min).to.equal(0);
    expect(skillResult.gameId).to.be.a('string');
    expect(skillResult.categoryId).to.be.a('string');
    // @ts-expect-error date
    expect(skillResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(skillResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(toRun);
});

test('it should successfully get an skill', (done) => {
  const toRun = createGame(knex)(
    S.Right({
      name: 'VtM',
      version: 'v5'
    })
  )
    .pipe(
      chain((result) =>
        createSkillCategory(knex)(
          S.Right({
            name: 'Mental',
            description: 'Mental skills.',
            gameId: result.id
          })
        )
      )
    )
    .pipe(
      chain((result) =>
        createSkill(knex)(
          S.Right({
            description: 'Your surroundings.',
            name: 'Awareness',
            max: 5,
            min: 0,
            categoryId: result.id,
            gameId: result.gameId
          })
        )
      )
    )
    .pipe(chain((result) => getSkill(knex)({ id: result.id })));

  fork(done)((skillResult: GameSkill) => {
    expect(skillResult.id).to.be.a('string');
    expect(skillResult.name).to.equal('Awareness');
    expect(skillResult.description).to.equal('Your surroundings.');
    expect(skillResult.max).to.equal(5);
    expect(skillResult.min).to.equal(0);
    expect(skillResult.gameId).to.be.a('string');
    expect(skillResult.categoryId).to.be.a('string');
    // @ts-expect-error date
    expect(skillResult.created.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    // @ts-expect-error date
    expect(skillResult.modified.toISOString()).to.match(new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
    done();
  })(toRun);
});
