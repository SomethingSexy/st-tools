import { expect } from 'chai';
import { fork, resolve } from 'fluture';
import { fake } from 'sinon';
import { createCharacter } from '../../../src/use-cases/create-character.js';

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
      chronicleGateway: {
        existsByReference: fake(),
        existsById: existsFake,
        create: fake(),
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      },
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
      chronicleGateway: {
        existsByReference: fake(),
        existsById: existsFake,
        create: fake(),
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      },
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
