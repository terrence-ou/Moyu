import {
  createApp,
  h,
  hFragment,
} from "https://unpkg.com/@ou-terrence/moyu@0.0.1";

// Model
const state = {
  turn: "O",
  board: new Array(9).fill(undefined),
  winner: null,
};
const reducers = {
  toggle: (state, idx) => {
    const newState = {
      ...state,
      turn: state.turn === "O" ? "X" : "O",
    };
    newState.board[idx] = state.turn;
    return newState;
  },
};

function App(state, emit) {
  return hFragment([
    h("h1", {}, ["Tic Tac Toe"]),
    makeBoard(state, emit),
  ]);
}

function makeBoard(state, emit) {
  const board = [
    h("div", { class: "board-row" }, []),
    h("div", { class: "board-row" }, []),
    h("div", { class: "board-row" }, []),
  ];
  state.board.forEach((cellVal, i) => {
    board[Math.floor(i / 3)].children.push(
      makeButton(cellVal, i, emit)
    );
  });
  return h("div", { class: "board" }, [...board]);
}

function makeButton(cellVal, i, emit) {
  return h(
    "button",
    {
      disabled: cellVal === undefined ? false : true,
      on: { click: () => emit("toggle", i) },
    },
    [`${cellVal === undefined ? " " : cellVal}`]
  );
}

createApp({ state, reducers, view: App }).mount(document.body);
