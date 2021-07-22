import { S } from '../../../src/utils/sanctuary.js';
import { createGameEntity } from '../../../src/entities/game.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createGameEntity({
        name: 'VtM',
        version: 'v5'
      })
    )
  ).to.deep.equal({
    name: 'VtM',
    version: 'v5'
  });
});

test('should create an invalid entity', () => {
  expect(S.fromLeft('fail')(createGameEntity({}))).to.equal('"name" is required');

  expect(
    S.fromLeft('fail')(
      createGameEntity({
        name: 'VtM'
      })
    )
  ).to.equal('"version" is required');
});
