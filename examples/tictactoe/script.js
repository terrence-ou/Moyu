import {
  createApp,
  h,
  hFragment,
} from "https://unpkg.com/@ou-terrence/moyu@0.0.1";

const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Model
const state = {
  turn: "O",
  board: new Array(9).fill(undefined),
  winner: undefined,
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
  "check-winner": (state) => {
    for (const [a, b, c] of combinations) {
      if (
        state.board[a] === undefined ||
        state.board[b] === undefined ||
        state.board[c] === undefined
      )
        continue;
      if (
        state.board[a] === state.board[b] &&
        state.board[b] === state.board[c]
      )
        return { ...state, winner: state.board[a] };
    }
    if (state.board.includes(undefined)) return { ...state };
    return { ...state, winner: "tie" };
  },
};

function App(state, emit) {
  const currStateText =
    state.winner === undefined
      ? `Turn ${state.turn}`
      : state.winner === "tie"
        ? "Game end. It is a tie."
        : `Game end, ${state.winner} is the winner!`;

  return hFragment([
    h("h1", {}, ["Moyu Tic Tac Toe"]),
    h("p", {}, [currStateText]),
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
      makeButton(cellVal, i, emit, state.winner)
    );
  });
  return h("div", { class: "board" }, [...board]);
}

function makeButton(cellVal, i, emit, winner) {
  return h(
    "button",
    {
      disabled:
        cellVal !== undefined || winner !== undefined ? true : false,
      on: {
        click: () => {
          emit("toggle", i);
          emit("check-winner");
        },
      },
    },
    [`${cellVal === undefined ? " " : cellVal}`]
  );
}

createApp({ state, reducers, view: App }).mount(document.body);
