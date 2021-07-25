import { fork, resolve } from 'fluture';
import { expect } from 'chai';
import { fake } from 'sinon';
import { getGameRace } from '../../../src/use-cases/get-game-race';

test('should get a race', (done) => {
  const existsFake = fake.returns(resolve(true));
  const getFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      description: 'foo',
      gameId: 'gameId'
    })
  );
  fork(done)((x) => {
    expect(x).to.deep.equal({
      id: 'foo',
      name: 'Foo',
      description: 'foo',
      gameId: 'gameId'
    });
    done();
  })(
    getGameRace(
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
      id: 'foo',
      gameId: 'gameId'
    })
  );
});

test('should return a failed state for the game not being found', (done) => {
  const existsFake = fake.returns(resolve(false));
  const getFake = fake();
  fork((x) => {
    expect(x).to.equal('Game with id gameId does not exist.');
    done();
  })(done)(
    getGameRace(
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
      id: 'foo',
      gameId: 'gameId'
    })
  );
});
