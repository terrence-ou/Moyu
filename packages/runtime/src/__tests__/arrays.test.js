import { it, expect, describe } from "vitest";
import {
  withoutNulls,
  arraysDiff,
  arraysDiffSequence,
  makeCountMap,
  ARRAY_DIFF_OP,
} from "../utils/arrays";

describe("Testing withoutNulls funtion", () => {
  it("array with nulls", () => {
    const testArr = ["a", null, "b", "c", null];
    const result = withoutNulls(testArr);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("array with undefied", () => {
    const testArr = [undefined, "undefined", "void"];
    const result = withoutNulls(testArr);
    expect(result).toEqual(["undefined", "void"]);
  });

  it("array filled with nulls and undefined", () => {
    const nullArr = new Array(10).fill(null);
    const undefinedArr = new Array(10).fill(undefined);
    const resultNullArr = withoutNulls(nullArr);
    const resultUndefArr = withoutNulls(undefinedArr);
    expect(resultNullArr).toEqual([]);
    expect(resultUndefArr).toEqual([]);
  });
});

// In the arraysDiff function, the output sequence is not impotant
describe("Testing arraysDiff function", () => {
  // Sequence is not important
  it("array items removed", () => {
    let oldArr = [1, 1, 2, 2, 3, 4, 5];
    let newArr = [1, 2, 3, 4, 5];
    let diff = arraysDiff(oldArr, newArr);
    expect(makeCountMap(diff.added)).toEqual(new Map([]));
    expect(makeCountMap(diff.removed)).toEqual(
      new Map([
        [1, 1],
        [2, 1],
      ]),
    );

    oldArr = [1, 1, 2, 2, 1, 4, 3, 4, 5, 1, 1, 5, 7, 8, 9];
    newArr = [1, 2, 3, 4];
    diff = arraysDiff(oldArr, newArr);
    expect(makeCountMap(diff.added)).toEqual(new Map([]));
    expect(makeCountMap(diff.removed)).toEqual(
      new Map([
        [1, 4],
        [2, 1],
        [4, 1],
        [5, 2],
        [7, 1],
        [8, 1],
        [9, 1],
      ]),
    );
  });

  it("new items added to the array", () => {
    let oldArr = [1, 2, 3, 4, 5];
    let newArr = [1, 1, 2, 2, 3, 4, 5];
    let diff = arraysDiff(oldArr, newArr);
    expect(makeCountMap(diff.removed)).toEqual(new Map([]));
    expect(makeCountMap(diff.added)).toEqual(
      new Map([
        [1, 1],
        [2, 1],
      ]),
    );

    oldArr = [1, 2, 3, 4];
    newArr = [1, 1, 2, 2, 1, 4, 3, 4, 5, 1, 1, 5, 7, 8, 9];
    diff = arraysDiff(oldArr, newArr);
    expect(makeCountMap(diff.added)).toEqual(
      new Map([
        [1, 4],
        [2, 1],
        [4, 1],
        [5, 2],
        [7, 1],
        [8, 1],
        [9, 1],
      ]),
    );
    expect(makeCountMap(diff.removed)).toEqual(new Map([]));
  });
});

describe("Testing arraysDiffSequence function", () => {
  it("testing removing item from the array", () => {
    const oldArr = [0, 1];
    const newArr = [1];
    const sequence = arraysDiffSequence(oldArr, newArr);
    const expectedSeq = [
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 0 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 1, index: 0, item: 1 },
    ];
    expect(sequence).toEqual(expectedSeq);
  });

  it("testing adding item to the array", () => {
    const oldArr = [];
    const newArr = [1];
    const sequence = arraysDiffSequence(oldArr, newArr);
    const expectedSeq = [{ op: ARRAY_DIFF_OP.ADD, index: 0, item: 1 }];
    expect(sequence).toEqual(expectedSeq);
  });

  it("testing noop operation", () => {
    const oldArr = [0];
    const newArr = [0];
    const sequence = arraysDiffSequence(oldArr, newArr);
    const expectedSeq = [
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 0, item: 0 },
    ];
    expect(sequence).toEqual(expectedSeq);
  });

  it("testing moving items", () => {
    const oldArr = [0, 1];
    const newArr = [1, 0];
    const sequence = arraysDiffSequence(oldArr, newArr);
    const expectedSeq = [
      { op: ARRAY_DIFF_OP.MOVE, originalIndex: 1, from: 1, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 1, item: 0 },
    ];
    expect(sequence).toEqual(expectedSeq);
  });

  it("test remove all items that not in the new array", () => {
    const oldArr = [0, 1, 2];
    const newArr = [];
    const sequence = arraysDiffSequence(oldArr, newArr);
    const expectedSeq = [
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 0 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 2 },
    ];
    expect(sequence).toEqual(expectedSeq);
  });
});
