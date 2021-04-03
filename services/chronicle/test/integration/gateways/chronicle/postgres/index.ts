import { createChronicle } from '../../../../../src/gateways/chronicle/postgres/index';
import { Right } from 'sanctuary';
import { fork } from 'fluture';
import { getConnection } from '../../../../../src/databases/postgres';
import { expect } from 'chai';

describe('gateways', () => {
  describe('chroncile', () => {
    it('should create a chronicle', (done) => {
      const output = createChronicle(getConnection())(
        Right({
          name: 'foo',
          game: 'vtm',
          version: 'v5',
          referenceId: 'foo'
        })
      );

      fork(done)((r) => {
        expect(r).to.have.keys(['id', 'name', 'referenceId', 'game', 'version']);
        done();
      })(output);
    });
  });
});
