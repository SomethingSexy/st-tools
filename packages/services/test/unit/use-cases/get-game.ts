import { fork, resolve } from 'fluture';
import { expect } from 'chai';
import { fake } from 'sinon';
import { getGame } from '../../../src/use-cases/get-game';

test('should get a game', (done) => {
  const existsFake = fake.returns(resolve(true));
  const getFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      description: 'foo'
    })
  );
  fork(done)((x) => {
    expect(x).to.deep.equal({
      id: 'foo',
      name: 'Foo',
      description: 'foo'
    });
    done();
  })(
    getGame(
      // @ts-expect-error - don't need all gateways
      {
        gameGateway: {
          exists: existsFake,
          getGame: getFake,
          getRace: fake(),
          create: fake()
        }
      }
    )({
      id: 'foo'
    })
  );
});

test('should return a failed state for the game not being found', (done) => {
  const existsFake = fake.returns(resolve(false));
  const getFake = fake();
  fork((x) => {
    expect(x).to.equal('Game with id foo does not exist.');
    done();
  })(done)(
    getGame(
      // @ts-expect-error - don't need all gateways
      {
        gameGateway: {
          exists: existsFake,
          getGame: fake(),
          getRace: getFake,
          create: fake()
        }
      }
    )({
      id: 'foo'
    })
  );
});
