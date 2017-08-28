import * as api from '../util/api'
import * as auth from '../util/auth'
import * as actions from '../actions/UserActionsCreators'

//---------------------------------------------
// auth

export const clearMessage = () => {
  return {
    type: actions.CLEAR_MESSAGE,
  };
}

export const loginSuccess = json => {
  return {
    type: actions.LOGIN_SUCCESS,
    data: json,
  };
}

export const loginFailure = msg => {
  return {
    type: actions.LOGIN_FAILURE,
    message: msg,
  };
}

export const logoutSuccess = () => {
  return {
    type: actions.LOGOUT_SUCCESS,
  };
}

export const signupSuccess = json => {
  return {
    type: actions.SIGNUP_SUCCESS,
    data: json,
  };
}

export const signupFailure = msg => {
  return {
    type: actions.SIGNUP_FAILURE,
    message: msg,
  };
}

export const setMessage = msg => {
  return {
    type: actions.SET_MESSAGE,
    message: msg,
  };
}

export const login = credencials => dispatch => {
  dispatch(clearMessage())
  return auth.login(credencials)
  .then(res => {
    if( res.data ) {
      if( 'user' in res.data ) {
        dispatch(loginSuccess(res.data.user))
        return
      }
      if( 'msg' in res.data ) {
        console.log("Erro no login. auth.login(",credencials,"): ", res.data.msg);
        return dispatch(loginFailure( res.data.msg ))
      }
    }
    console.log("Erro no login. Não foi possivel autenticação com auth.login(",credencials,"): ", res);
    return dispatch(loginFailure( 'Erro no servidor.' ))
  })
}

export const signup = userRequest => dispatch => {
  dispatch(clearMessage())
  return auth.signup(userRequest)
  .then(res => {
    if( res.data ) {
      if( 'user' in res.data ) {
        dispatch(signupSuccess(res.data.user))
        return true
      }
      if( 'msg' in res.data ) {
        console.log("Erro no signup. auth.signup(",userRequest,"): ", res.data.msg);
        return dispatch(signupFailure( res.data.msg ))
      }
    }
    console.log("Erro no signup. Não foi possivel cadastrar com auth.signup(",userRequest,"): ", res);
    return dispatch(signupFailure( 'Erro no servidor.' ))
  })
}

export const logout = token => dispatch => {}

//---------------------------------------------
// comments

export const addComments = comments => {
  return {
    type: actions.ADD_COMMENTS,
    comments,
  }
}

export const fetchComments = userId => dispatch => api.getAll('user', userId)
  .then(res => dispatch(addComments(res.comments)))

export const sendComment = toUser => dispatch => api.getOne('user', toUser)
  .then(res => {
    toUser.concat(res.comments)
    return api.updateOne('user', toUser)
  })

export const deleteComments = userId => dispatch => api.updateOne('user', { id: userId, comments: [] })
  .then(res => dispatch(deleteComments()))

//---------------------------------------------
// afiliação

export const addMyAffiliates = myAffiliates => {
  return {
    type: actions.ADD_MY_AFFILIATES,
    myAffiliates,
  }
}

export const fetchMyAffiliates = affiliatesIds => dispatch => api.getAll('user')
  .then(users => dispatch(updateTotalUsers(users.length)).then(() => users))
  .then(users => users.filter(user => user.id in affiliatesIds))
  .then(myAffiliates => dispatch(addMyAffiliates(myAffiliates)))

export const updateTotalUsers = totalUsers => {
  return {
    type: actions.UPDATE_TOTAL_USERS,
    totalUsers,
  }
}

// export const fetchMyAffiliates = affiliatesIds => dispatch => api.getAll('product')
//   .then(res => {
//     const myAffiliates = _.filter(users, user => _.contains(affiliates, user.id))
//     if( affiliates ) dispatch(addAffiliates(myAffiliates))
//     return
//   })
//
//

//---------------------------------------------
// profile

export const updateUser = user => {
  return {
    type: actions.UPDATE_USER,
    user,
  };
}

export const updateUserRequest = user => dispatch => api.updateOne('user', user)
  .then(res => dispatch(updateUser(res.user)))

export const fetchUser = id => dispatch => api.getOne('user', id)
  .then(res => dispatch(updateUser(res)))
