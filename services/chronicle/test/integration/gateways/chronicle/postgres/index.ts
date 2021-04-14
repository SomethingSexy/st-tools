import { createChronicle, getChronicleById } from '../../../../../src/gateways/chronicle/postgres/index';
import { Right } from 'sanctuary';
import { fork } from 'fluture';
import { expect } from 'chai';
import { config, connection } from '../../../connection';
import { Chronicle } from '../../../../../src/entities/chronicle';
import { databaseManagerFactory } from 'knex-db-manager';

beforeAll(() => {
  return databaseManagerFactory(config)
    .dropDb()
    .then(() => databaseManagerFactory(config).createDb())
    .then(() => console.log('beforeAll complete'));
});

test('should create a chronicle', (done) => {
  const output = createChronicle(connection)(
    Right({
      name: 'foo',
      game: 'vtm',
      version: 'v5',
      referenceId: 'foo'
    })
  );

  fork(done)((r: Chronicle) => {
    expect(r).to.have.keys(['id', 'name', 'referenceId', 'game', 'version', 'created', 'modified', 'referenceType']);
    fork(done)((c) => {
      expect(c).to.have.keys(['id', 'name', 'referenceId', 'game', 'version', 'created', 'modified', 'referenceType']);
      connection.destroy(done);
      // done();
    })(getChronicleById(connection)(r.id));
  })(output);
});
