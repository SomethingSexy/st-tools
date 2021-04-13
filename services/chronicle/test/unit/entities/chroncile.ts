import { createChronicleEntity } from '../../../src/entities/chronicle';
import { expect } from 'chai';
import { S } from '../../../src/utils/sanctuary';

describe('entity:chronicle', () => {
  describe('create', () => {
    context('when valid', () => {
      it('should create a valid task', () => {
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

      it('should create an invalid task', () => {
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
    });
  });
});
