import { S } from '../../../src/utils/sanctuary.js';
import { createChronicleEntity } from '../../../src/entities/chronicle.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createChronicleEntity({
        name: 'Foo',
        game: 'vtm',
        referenceId: 'foo',
        referenceType: 'discord',
        version: 'v5'
      })
    )
  ).to.deep.equal({
    name: 'Foo',
    game: 'vtm',
    referenceId: 'foo',
    referenceType: 'discord',
    version: 'v5'
  });
});

test('should create an invalid entity', () => {
  expect(
    S.fromRight('fail')(
      createChronicleEntity({
        name: 'Foo',
        referenceId: 'foo',
        version: 'v5'
      })
    )
  ).to.equal('fail');
});
