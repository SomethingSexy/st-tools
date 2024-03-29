import { fork, resolve } from 'fluture';
import { createCharacter } from '../../../src/use-cases/create-character.js';
import { expect } from 'chai';
import { fake } from 'sinon';

test('should create a new one', (done) => {
  const existsFake = fake.returns(resolve(true));
  const createFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      splat: 'human',
      chronicleId: 'bar'
    })
  );
  fork(done)((x) => {
    expect(x).to.deep.equal({
      id: 'foo',
      name: 'Foo',
      splat: 'human',
      chronicleId: 'bar'
    });
    done();
  })(
    createCharacter({
      // @ts-expect-error - don't need all gateways
      chronicleGateway: {
        existsByReference: fake(),
        existsById: existsFake,
        create: fake(),
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      },
      // @ts-expect-error - don't need all gateways
      characterGateway: {
        create: createFake
      }
    })({
      name: 'Foo',
      splat: 'human',
      chronicleId: 'bar',
      referenceType: 'discord'
    })
  );
});

test('should return a failed state', (done) => {
  const existsFake = fake.returns(resolve(false));
  const createFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      splat: 'human',
      chronicleId: 'bar'
    })
  );
  fork((x) => {
    expect(x).to.equal('Chronicle with bar does not exist.');
    done();
  })(done)(
    createCharacter({
      // @ts-expect-error - don't need all gateways
      chronicleGateway: {
        existsByReference: fake(),
        existsById: existsFake,
        create: fake(),
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      },
      // @ts-expect-error - don't need all gateways
      characterGateway: {
        create: createFake
      }
    })({
      name: 'Foo',
      splat: 'human',
      chronicleId: 'bar',
      referenceType: 'discord'
    })
  );
});
