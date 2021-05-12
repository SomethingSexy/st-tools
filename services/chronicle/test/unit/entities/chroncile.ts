import { createChronicleEntity } from '../../../src/entities/chronicle.js';
import { expect } from 'chai';
import { S } from '../../../src/utils/sanctuary.js';

test('should create a valid task', () => {
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

test('should create an invalid task', () => {
  expect(
    S.fromRight('fail')(
      // @ts-expect-error - testing error scenario
      createChronicleEntity({
        name: 'Foo',
        referenceId: 'foo',
        version: 'v5'
      })
    )
  ).to.equal('fail');
});
