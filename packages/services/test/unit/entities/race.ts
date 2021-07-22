import { S } from '../../../src/utils/sanctuary.js';
import { createRaceEntity } from '../../../src/entities/race.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createRaceEntity({
        name: 'Vampire',
        description: 'Blood sucker',
        gameId: '1'
      })
    )
  ).to.deep.equal({
    name: 'Vampire',
    description: 'Blood sucker',
    gameId: '1'
  });
});

test('should create an invalid entity', () => {
  expect(S.fromLeft('fail')(createRaceEntity({}))).to.equal('"name" is required');

  expect(
    S.fromLeft('fail')(
      createRaceEntity({
        name: 'Blood sucker'
      })
    )
  ).to.equal('"description" is required');

  expect(
    S.fromLeft('fail')(
      createRaceEntity({
        name: 'Vampire',
        description: 'Blood sucker'
      })
    )
  ).to.equal('"gameId" is required');
});
