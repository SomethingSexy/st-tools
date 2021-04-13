import { createChronicle } from '../../../../../src/gateways/chronicle/postgres/index';
import { Right } from 'sanctuary';
import { fork } from 'fluture';
import { expect } from 'chai';
import { connection } from '../../../connection';

describe('gateways', () => {
  describe('chronicle', () => {
    it('should create a chronicle', (done) => {
      // @ts-expect-error
      const output = createChronicle(connection)(
        Right({
          name: 'foo',
          game: 'vtm',
          version: 'v5',
          referenceId: 'foo'
        })
      );

      fork(done)((r) => {
        expect(r).to.have.keys(['id', 'name', 'referenceId', 'game', 'version', 'created', 'modified', 'referenceType']);
        done()
      })(output);
    });
  });
});
