import {
  createApp,
  h,
  hFragment,
} from "https://unpkg.com/@ou-terrence/moyu@0.0.1";

// Model

const state = new Array(9).fill(0);
const reducers = {
  toggle: (state, idx) => {
    const newState = [...state];
    if (newState[idx] === 0) {
      newState[idx] = 1;
    }
    return newState;
  },
};

function App(state, emit) {
  return hFragment([h("h1", {}, ["Tic Tac Toe"])]);
}

function makeBoard(state, emit) {
  const board = new Array(3).fill(h("div", {}, []));
  state.forEach((cell, i) => {
    board[Math.floor(i / 3)];
  });
}
