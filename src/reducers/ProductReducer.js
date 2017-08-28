import * as actions from '../actions/ProductActionsCreators'

const initialState = {
  activePage: 1,
  data: [],
  search: [],
}

const ProductReducer = (state = initialState, action) => {
  console.log("====================== reducer: ");
  console.log("",action);
  console.log("======================");
  switch (action.type) {

    case actions.CHANGE_PAGE :
      return Object.assign({}, state, { activePage: action.activePage });

    case actions.UPDATE_LIST:
      return {
        ...state,
        data: state.data.filter(product => action.cuids.some(cuid => cuid === product.cuid)),
      }

    case actions.ADD_PRODUCT :
      return {
        ...state,
        data: [
          ...state.data,
          action.product
        ],
      }

    case actions.ADD_PRODUCTS :
      return {
        ...state,
        data: action.products,
      }

    case actions.UPDATE_PRODUCT :

      let newData = state.data.filter(product => product.id !== action.product.id)
      newData.unshift(action.product)

      return {
        ...state,
        data: newData,
      }

    case actions.DELETE_PRODUCT :
      return {
        ...state,
        data: state.data.filter(product => product.id !== action.id),
      }

    default:
      return state
  }
}

export const getProducts = state => state.products.data

export const getSearchString = state => state.products.search

export const getActivePage = state => state.products.activePage

export const getProduct = (state, id) =>
  state.products.data.filter(product => product.id === id)[0]

export const getMyProducts = (state, userId) => state.products.data.filter(prod => prod.owner === userId)




export default ProductReducer
