import { createTable } from '../../../../../src/gateways/character/postgres/index';
import { getConnection } from '../../../../../src/databases/postgres';
import { mock, getTracker } from 'mock-knex';
import { expect } from 'chai';
import { fork } from 'fluture';

const connection = getConnection();

mock(connection);

// TODO: Need to figure out tracker, for some reason it stops all queries from running
// const tracker = getTracker();
// beforeEach(() => {
//   tracker.install();
// })
// afterEach(() => {
//   tracker.uninstall();
// })

test('should successfully create the character table', (done) => {
  fork(done)((result) => {
    expect(result).to.not.be.an('undefined');
    done();
  })(createTable(connection)({
    name: 'Foo',
    splat: 'vampire'
  }))
});
