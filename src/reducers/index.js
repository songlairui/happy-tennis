import { combineReducers } from 'redux'
import counter from './counter'
import terms from './terms'

export default combineReducers({
  counter,
  terms
})
