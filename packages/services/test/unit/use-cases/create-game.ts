import { fork, resolve } from 'fluture';
import { createGame } from '../../../src/use-cases/create-game.js';
import { expect } from 'chai';
import { fake } from 'sinon';

test('should create a new one', (done) => {
  const createFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      version: 'v5'
    })
  );
  fork(done)((x) => {
    expect(x).to.deep.equal({
      id: 'foo',
      name: 'Foo',
      version: 'v5'
    });
    done();
  })(
    createGame({
      // @ts-expect-error - don't need all gateways
      gameGateway: {
        create: createFake
      }
    })({
      name: 'Foo',
      version: 'v5'
    })
  );
});
