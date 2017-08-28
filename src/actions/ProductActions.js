import cuid from 'cuid'

import * as actions from './ProductActionsCreators'
import * as algolia from '../util/algolia'
import * as aws from '../util/aws'
import * as api from '../util/api'

export const changePage = activePage => {
  return {
    type: actions.CHANGE_PAGE,
    activePage,
  };
}

export const addProduct = product => {
  return {
    type: actions.ADD_PRODUCT,
    product,
  }
}

export const addProducts = products => {
  return {
    type: actions.ADD_PRODUCTS,
    products,
  }
}

export const updateProduct = product => {
  return {
    type: actions.UPDATE_PRODUCT,
    product,
  }
}

export const updateList = products => {
  return {
    type: actions.UPDATE_LIST,
    products,
  }
}

export const deleteProduct = id => {
  return {
    type: actions.DELETE_PRODUCT,
    id,
  }
}

export const affiliate = (productId, userId, isAffiliate) => dispatch => api.getOne('product', productId)
  .then(res => {
    let affiliates = res.affiliates
    if( isAffiliate ) affiliates = affiliates.filter(id => id !== userId)
    else affiliates.push(userId)
    const product = { affiliates: affiliates, id: productId }
    return api.updateOne('product', product)
  })
  .then(res => dispatch(updateProduct(res.product)))

export const fetchProduct = id => dispatch => api.getOne('product', id)
  .then(res => dispatch(addProduct(res)))

export const fetchProducts = userId => dispatch => api.getAll('product')
  .then(res => dispatch(addProducts(res)))
  .then(() => api.getAll('user'))
  // .then(res => dispatch(updateTotalUsers(res.length)))

export const fetchMyProducts = userId => dispatch => api.getAll('product')
  .then(res => {
    const myProducts = res.filter(product => product.owner === userId)
    dispatch(addMyProducts(myProducts))
  })

  export const addAffiliates = myAffiliates => {
  return {
    type: actions.SET_MY_AFFILIATES,
    myAffiliates,
  }
}

export const deleteProductRequest = (id, cuid) => dispatch => api.deleteOne('product', id)
  .then(() => algolia.deleteProduct(cuid))
  .then(() => dispatch(deleteProduct(id)))

export const findProduct = cuid => api.getAll('product')
  .then(products => products.find(product => product.cuid === cuid))

export const addProductRequest = (product, userId) => {
  const myId = cuid()
  return (dispatch) =>
    aws.addAllbum(product.thumb)
    .then(thumb => {
      product.thumb = thumb
      product.cuid = myId
      return api.addOne('product', product)
    })
    .then(() => findProduct(myId))
    .then(added => algolia.addProduct(added))
    .then(res => dispatch(addProduct(res)))
}

export const updateProductRequest = product => dispatch => aws.addAllbum(product.thumb)
  .then(thumb => {
    product.thumb = thumb
    return api.updateOne('product', product)
  })
  .then(res => {
    res.product.totalAffiliates = res.product.affiliates.length
    return algolia.updateProduct(res.product)
  })
  .then(res => dispatch(updateProduct(res)))

// https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png
