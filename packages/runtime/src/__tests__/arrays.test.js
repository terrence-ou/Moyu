import { it, expect, describe } from "vitest";
import { withoutNulls, arraysDiff } from "../utils/arrays";

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
