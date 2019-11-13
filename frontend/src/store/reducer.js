import {setToken, removeToken} from '../api/jsqel'

const reducer = (state, action) => {
    switch(action.type) {
      case 'LOGIN':
        setToken(action.token)
        return { username: action.username, token:action.token }
      case 'LOGOUT' :
        removeToken()
        return { username: '', token:'' }
      case 'UPDATE' :
        return { ...state, ...action.payload }
      default:
        return state
    }
}

const initialStore = {username:''}

export {reducer, initialStore}




