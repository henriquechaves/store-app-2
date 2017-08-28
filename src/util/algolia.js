import algoliasearch from 'algoliasearch'
import config from '../../server/config.js'

const client = algoliasearch(config.algoliaAppID, config.algoliaServerKey, { protocol: 'https:' })
const index = client.initIndex(config.algoliaIndexName)

export const initIndex = () =>
  client.initIndex(config.algoliaIndexName)

export const configIndex = () =>
  index.setSettings(config.algoliaSettings)

export const clearProducts = () => index.clearIndex()

export const addProduct = product =>
  index.addObject(Object.assign({}, product, { objectID: product.cuid })).then(res => product)

export const updateProduct = (prod) =>
  index.saveObject(Object.assign({}, prod, { objectID: prod.cuid })).then(res => prod).catch(err => err)

export const addProducts = arrayProducts => {
  const products = arrayProducts.map(prod => Object.assign({}, prod, { objectID: prod.cuid }))
  return index.addObjects(products).then(res => arrayProducts)
}

export const deleteProduct = cuid => index.deleteObject(cuid).then(res => cuid)
