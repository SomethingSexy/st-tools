import { expect } from 'chai';
import { fork, reject, resolve } from 'fluture';
import { fake } from 'sinon';
import { createChronicle } from '../../src/use-cases/create-chronicle.js';

test('should create a new one', (done) => {
  const existsFake = fake.returns(fake.returns(resolve(false)));
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
      existsByReference: existsFake,
      create: createFake,
      getChronicle: fake()
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
  const existsFake = fake.returns(fake.returns(resolve(true)));
  const createFake = fake.returns(reject('Chronicle with foo already exists.'));

  fork((x) => {
    expect(x).to.equal('Chronicle with foo already exists.');
    done();
  })(done)(
    createChronicle({
      existsByReference: existsFake,
      create: createFake,
      getChronicle: fake()
    })({
      name: 'Foo',
      game: 'vtm',
      referenceId: 'foo',
      referenceType: 'discord',
      version: 'v5'
    })
  );
});
