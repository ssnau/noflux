import State from 'dataton';

// load initial state
const initialState = typeof window !== 'undefined' ? window._appState : {};

const state = new State(initialState);
export default state;

if (typeof window !== 'undefined') {
  window._state = state; // for debug
}
