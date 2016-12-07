import {
  ${actionTypes.begin},
  ${actionTypes.success},
  ${actionTypes.failure},
  ${actionTypes.dismissError},
} from 'src/features/${_.kebabCase(feature)}/redux/constants';

import {
  ${_.camelCase(action)},
} from 'src/features/${_.kebabCase(feature)}/redux/sagas/${_.camelCase(action)}';

describe('${_.kebabCase(feature)}/redux/sagas/${_.camelCase(action)}', () => {
  const generator = ${_.camelCase(action)};

  it('should call delay(100)', () => {
    expect(generator.next().value).to.deep.equal(call(delay, 100));
    expect(generator.next().value).to.deep.equal(put({});
  });

  it('should work', () => {
    expect(generator.next().value).to.deep.equal(call(delay, 100));
    expect(generator.next().value).to.deep.equal(put({});
  });

  it('should work', () => {
    expect(generator.next().value).to.deep.equal(call(delay, 100));
    expect(generator.next().value).to.deep.equal(put({});
  });
});

import test from 'tape'

import { put, call, select } from '../../../src/effects'
import { ${} } from '../src/sagas'

const products = [1], cart = [1] // dummy values
const state = { products, cart }
const getState = () => state

test('getProducts Saga test', function (t) {

  const generator = getAllProducts(getState)

  let next = generator.next(actions.getAllProducts())
  t.deepEqual(next.value, call(api.getProducts),
    "must yield api.getProducts"
  )

  next = generator.next(products)
  t.deepEqual(next.value, put(actions.receiveProducts(products)),
    "must yield actions.receiveProducts(products)"
  )

  t.end()

})


test('checkout Saga test', function (t) {


  const generator = checkout()

  let next = generator.next()
  t.deepEqual(next.value, select(getCart),
    "must select getCart"
  )

  next = generator.next(cart)
  t.deepEqual(next.value, call(api.buyProducts, cart),
    "must call api.buyProducts(cart)"
  )

  next = generator.next()
  t.deepEqual(next.value, put(actions.checkoutSuccess(cart)),
    "must yield actions.checkoutSuccess(cart)"
  )

  t.end()
})