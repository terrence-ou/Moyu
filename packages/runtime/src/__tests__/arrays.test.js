import { it, expect, describe } from "vitest";
import {
  withoutNulls,
  arraysDiff,
  arraysDiffSequence,
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

describe("Testing arraysDiff function", () => {
  // Will solve this problem in the future
  // it("array items removed", () => {
  //   const oldArr = [1, 1, 2, 2, 3, 4, 5];
  //   const newArr = [1, 2, 3, 4, 5];
  //   const { added, removed } = arraysDiff(oldArr, newArr);
  //   expect(added).toEqual([]);
  //   expect(removed).toEqual([1, 2]);
  // });
  it("new items added to the array", () => {
    const oldArr = [1, 2, 3, 4];
    const newArr = [0, 1, 2, 3, 4, 5];
    const { added, removed } = arraysDiff(oldArr, newArr);
    expect(added).toEqual([0, 5]);
    expect(removed).toEqual([]);
  });

  it("items removed from the old arr", () => {
    const oldArr = [0, 1, 2, 3, 4, 5];
    const newArr = [1, 2, 3, 4];
    const { added, removed } = arraysDiff(oldArr, newArr);
    expect(added).toEqual([]);
    expect(removed).toEqual([0, 5]);
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
