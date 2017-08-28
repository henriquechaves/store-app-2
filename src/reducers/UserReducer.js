import * as actions from '../actions/UserActionsCreators'

const initialState = {
  id: 0,
  type: '',
  email: '',
  token: '',
  message: '',
  showActions: false,
  comments: [],
  myAffiliates: [],
  totalUsers: 0,
}

const UserReducer = (state = initialState, action) => {

  switch (action.type) {

    case actions.SIGNUP_SUCCESS :
      return Object.assign({}, state, { id: action.data.id, type: action.data.type, email: action.data.email, showActions: true, token: action.data.token, message: 'token: '+action.data.token })

    case actions.SIGNUP_FAILURE :
      return Object.assign({}, state, { message: action.message })

    case actions.LOGIN_SUCCESS :
      return Object.assign({}, state, { id: action.data.id, type: action.data.type, email: action.data.email, showActions: true, token: action.data.token, message: 'token: '+action.data.token })

    case actions.LOGIN_FAILURE :
      return Object.assign({}, state, { message: action.message })

    case actions.LOGOUT_SUCCESS :
      return Object.assign({}, state, { id: '', type: '', email: '', message: '', showActions: false, token: '' })

    case actions.UPDATE_USER :
      return Object.assign({}, state, {
        id: action.id,
        type: action.type,
        email: action.email,
        message: state.message,
        token: action.token,
        showActions: state.showActions,
        comments: action.comments,
      })

    case actions.SET_MESSAGE :
    return Object.assign({}, state, { message: action.message })


    case actions.CLEAR_MESSAGE :
      return Object.assign({}, state, { message: '' })

    case actions.ADD_COMMENTS :
      return Object.assign({}, state, { comments: action.comments })

    case actions.DELETE_COMMENTS :
      return Object.assign({}, state, { comments: [] })

    case actions.UPDATE_TOTAL_USERS :
      return Object.assign({}, state, { totalUsers: action.totalUsers })

    case actions.ADD_MY_AFFILIATES :
      return {
        ...state,
        myAffiliates: action.myAffiliates,
      }

    default:
      return state;

  }
}

export const getMyAffiliates = state => state.user.myAffiliates

export const getTotalUsers = state => state.user.totalUsers

export const getComments = state => state.user.comments

export const getUser = state => {
  return {
    id: state.user.id,
    type: state.user.type,
    email: state.user.email,
    message: JSON.stringify(state.user.message),
    token: state.user.token,
    showActions: state.user.showActions,
  }
}

export default UserReducer
