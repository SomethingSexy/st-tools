import { createAttributeEntity, updateAttributeEntity } from '../../../src/entities/attribute.js';
import { S } from '../../../src/utils/sanctuary.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createAttributeEntity({
        name: 'Intelligence',
        categoryId: '2',
        gameId: '1',
        description: 'Player intelligence',
        min: 0,
        max: 5
      })
    )
  ).to.deep.equal({
    name: 'Intelligence',
    categoryId: '2',
    gameId: '1',
    description: 'Player intelligence',
    min: 0,
    max: 5
  });
});

test('should create an invalid entity', () => {
  expect(
    S.fromLeft('fail')(
      createAttributeEntity({
        categoryId: '2',
        gameId: '1',
        description: 'Player intelligence',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"name" is required');

  expect(
    S.fromLeft('fail')(
      createAttributeEntity({
        name: 'Intelligence',
        gameId: '1',
        description: 'Player intelligence',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"categoryId" is required');

  expect(
    S.fromLeft('fail')(
      createAttributeEntity({
        name: 'Intelligence',
        categoryId: '2',
        description: 'Player intelligence',
        min: 0,
        max: 5
      })
    )
  ).to.equal('"gameId" is required');

  expect(
    S.fromLeft('fail')(
      createAttributeEntity({
        name: 'Intelligence',
        categoryId: '2',
        gameId: '1',
        description: 'Player intelligence',
        max: 5
      })
    )
  ).to.equal('"min" is required');

  expect(
    S.fromLeft('fail')(
      createAttributeEntity({
        name: 'Intelligence',
        categoryId: '2',
        gameId: '1',
        description: 'Player intelligence',
        min: 0
      })
    )
  ).to.equal('"max" is required');
});

test('should update an entity', () => {
  expect(
    S.fromRight({})(
      updateAttributeEntity({
        id: '1',
        name: 'Intelligence',
        description: 'Player intelligence',
        min: 0,
        max: 5
      })
    )
  ).to.deep.equal({
    id: '1',
    name: 'Intelligence',
    description: 'Player intelligence',
    min: 0,
    max: 5
  });
});
