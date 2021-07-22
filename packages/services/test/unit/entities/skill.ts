import { createSkillEntity, updateSkillEntity } from '../../../src/entities/skill.js';
import { S } from '../../../src/utils/sanctuary.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createSkillEntity({
        name: 'Melee',
        categoryId: '2',
        gameId: '1',
        description: 'Fighting skill',
        min: 0,
        max: 5
      })
    )
  ).to.deep.equal({
    name: 'Melee',
    categoryId: '2',
    gameId: '1',
    description: 'Fighting skill',
    min: 0,
    max: 5
  });
});

test('should create an invalid entity', () => {
  expect(
    S.fromLeft('fail')(
      createSkillEntity({
        categoryId: '2',
        gameId: '1',
        description: 'Fight skill',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"name" is required');

  expect(
    S.fromLeft('fail')(
      createSkillEntity({
        name: 'Melee',
        gameId: '1',
        description: 'Fight skill',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"categoryId" is required');

  expect(
    S.fromLeft('fail')(
      createSkillEntity({
        name: 'Melee',
        categoryId: '2',
        description: 'Fight skill',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"gameId" is required');

  expect(
    S.fromLeft('fail')(
      createSkillEntity({
        name: 'Melee',
        categoryId: '2',
        gameId: '1',
        description: 'Fight skill',
        max: 5
      })
    )
  ).to.equal('"min" is required');

  expect(
    S.fromLeft('fail')(
      createSkillEntity({
        name: 'Melee',
        categoryId: '2',
        gameId: '1',
        description: 'Fight skill',
        min: 0
      })
    )
  ).to.equal('"max" is required');
});

test('should update an entity', () => {
  expect(
    S.fromRight({})(
      updateSkillEntity({
        id: '1',
        name: 'Melee',
        description: 'Fight skill',
        min: 0,
        max: 5
      })
    )
  ).to.deep.equal({
    id: '1',
    name: 'Melee',
    description: 'Fight skill',
    min: 0,
    max: 5
  });
});
