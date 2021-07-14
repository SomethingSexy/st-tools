import { S } from '../../../src/utils/sanctuary.js';
import { expect } from 'chai';
import { updateCharacterEntity } from '../../../src/entities/character.js';

test('should create a valid task', () => {
  expect(
    S.fromRight({})(
      updateCharacterEntity({
        id: 'foo',
        name: 'Foo'
      })
    )
  ).to.deep.equal({
    id: 'foo',
    name: 'Foo'
  });

  expect(
    S.fromRight({})(
      updateCharacterEntity({
        id: 'foo'
      })
    )
  ).to.deep.equal({
    id: 'foo'
  });
});

test('should create an invalid task', () => {
  // if you include name and it is invalid fail
  expect(
    S.fromLeft('fail')(
      updateCharacterEntity({
        id: 'foo',
        name: ''
      })
    )
  ).to.deep.equal('"name" is not allowed to be empty');
});
