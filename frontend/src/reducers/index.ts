import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import api from './api'

export default (history:any) => combineReducers({
    router: connectRouter(history),
    api
})