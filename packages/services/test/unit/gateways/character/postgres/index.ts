import { createCharacter, createTable, updateCharacter } from '../../../../../src/gateways/character/postgres/index.js';
import { getConnection } from '../../../../../src/services/databases/postgres.js';
import { expect } from 'chai';
import { fork } from 'fluture';
import { mock } from 'mock-knex';
// import { S } from '../../../../../src/utils/sanctuary.js';
// import knex from 'knex';
// import { getTracker, MockClient, Tracker } from 'knex-mock-client';

const connection = getConnection();
mock(connection);

// const connection = knex({
//   client: MockClient
// })

// TODO: Need to figure out tracker, for some reason it stops all queries from running
// let tracker: Tracker;

// beforeEach(() => {
//   tracker = getTracker();
//   tracker.on
//   .any((rawQuery) => rawQuery.method === 'create' && rawQuery.sql.includes('"uuid-ossp"'))
//   .response(1);
// });

// afterEach(() => {
//   tracker.reset();
// });

test('should successfully create the character table', (done) => {
  fork(done)((result) => {
    expect(result).to.not.be.an('undefined');
    done();
  })(
    createTable(connection)({
      name: 'Foo',
      splat: 'vampire'
    })
  );
});

// TODO: Trouble getting both mock-knex and knex-mock-client to work
// test('should successfully update an existing character', (done) => {
//   fork(done)((result) => {
//     fork(done)((result) => {
//       expect(result).to.not.be.an('undefined');
//       done();
//     })(
//       updateCharacter(connection)(S.Right({
//         id:  result.id,
//         name: 'Foo Updated',
//         splat: 'vampire'
//       }))
//     );
//   })(
//     createCharacter(connection)(S.Right({
//       name: 'Foo',
//       splat: 'vampire'
//     }))
//   )
// })
