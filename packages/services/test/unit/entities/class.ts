import { createClassEntity, updateClassEntity } from '../../../src/entities/class.js';
import { S } from '../../../src/utils/sanctuary.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createClassEntity({
        name: 'Fighter',
        description: 'Fighter',
        gameId: '1'
      })
    )
  ).to.deep.equal({
    name: 'Fighter',
    description: 'Fighter',
    gameId: '1'
  });
});

test('should create an invalid entity', () => {
  expect(S.fromLeft('fail')(createClassEntity({}))).to.equal('"name" is required');

  expect(
    S.fromLeft('fail')(
      createClassEntity({
        name: 'Fighter'
      })
    )
  ).to.equal('"description" is required');

  expect(
    S.fromLeft('fail')(
      createClassEntity({
        name: 'Fighter',
        description: 'Fighter'
      })
    )
  ).to.equal('"gameId" is required');
});

test('should update an entity', () => {
  expect(
    S.fromRight({})(
      updateClassEntity({
        id: '1',
        name: 'Mental'
      })
    )
  ).to.deep.equal({
    id: '1',
    name: 'Mental'
  });
});
