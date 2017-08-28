import { combineReducers } from 'redux'

import products from './ProductReducer'
import user from './UserReducer'

export default combineReducers({
  products,
  user,
})
