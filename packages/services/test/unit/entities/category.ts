import { createCategoryEntity, updateCategoryEntity } from '../../../src/entities/category.js';
import { S } from '../../../src/utils/sanctuary.js';
import { expect } from 'chai';

test('should create a valid entity', () => {
  expect(
    S.fromRight({})(
      createCategoryEntity({
        name: 'Mental'
      })
    )
  ).to.deep.equal({
    name: 'Mental'
  });
});

test('should create an invalid entity', () => {
  expect(S.fromLeft('fail')(createCategoryEntity({}))).to.equal('"name" is required');
});

test('should update an entity', () => {
  expect(
    S.fromRight({})(
      updateCategoryEntity({
        id: '1',
        name: 'Mental'
      })
    )
  ).to.deep.equal({
    id: '1',
    name: 'Mental'
  });
});
