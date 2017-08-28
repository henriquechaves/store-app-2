import cuid from 'cuid'

import { getAll } from '../src/util/api'
import * as algolia from '../src/util/algolia'

const addCuid = products => products.map(prod =>
  ( 'cuid' in prod ) ? prod : Object.assign({}, prod, { cuid: cuid() })
)

export const dummyDataToAlgolia = () => {
  algolia.initIndex()
  algolia.configIndex()
  return algolia.clearProducts()
  .then(res => getAll('product'))
  .then(allProducts => algolia.addProducts(addCuid(allProducts)))
  .then(res => 'dummyData OK')
  .catch(err => `dummyData falhou: ${err}`)
}
