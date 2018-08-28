import { SWITCH_CLASS } from '../constants/terms'

export const switchClass = target => {
  return {
    type: SWITCH_CLASS,
    target
  }
}

// 异步的action
export function asyncSwitch() {
  return dispatch => {
    setTimeout(() => {
      dispatch(switchClass())
    }, 2000)
  }
}
