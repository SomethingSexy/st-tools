import { fork, resolve } from 'fluture';
import { createChronicle } from '../../../src/use-cases/create-chronicle.js';
import { expect } from 'chai';
import { fake } from 'sinon';

test('should create a new one', (done) => {
  const existsFake = fake.returns(resolve(false));
  const createFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    })
  );
  fork(done)((x) => {
    expect(x).to.deep.equal({
      id: 'foo',
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    });
    done();
  })(
    createChronicle({
      // @ts-expect-error - don't need all gateways
      chronicleGateway: {
        existsByReference: existsFake,
        existsById: fake(),
        create: createFake,
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      }
    })({
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    })
  );
});

test('should return a failed state', (done) => {
  const existsFake = fake.returns(resolve(true));
  const createFake = fake.returns(
    resolve({
      id: 'foo',
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    })
  );
  fork((x) => {
    expect(x).to.equal('Chronicle with foo already exists.');
    done();
  })(done)(
    createChronicle({
      // @ts-expect-error - don't need all gateways
      chronicleGateway: {
        existsByReference: existsFake,
        existsById: fake(),
        create: createFake,
        getChronicle: fake(),
        getChronicleById: fake(),
        list: fake()
      }
    })({
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    })
  );
});
