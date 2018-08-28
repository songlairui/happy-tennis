import { SWITCH_CLASS } from '../constants/terms'

const INITIAL_STATE = {
  current: 0
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SWITCH_CLASS:
      return {
        ...state,
        current: action.target
      }
    default:
      return state
  }
}
