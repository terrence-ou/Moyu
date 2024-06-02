import { it, describe, expect } from "vitest";
import { DOM_TYPES } from "../h";
import { areNodesEqual } from "../node-equal";

describe("Testing areNodesEqual function...", () => {
  it("tesing two nodes with same/different types", () => {
    const nodeOne = { type: DOM_TYPES.FRAGMENT, children: ["1", "2"] };
    const nodeTwo = { type: DOM_TYPES.ELEMENT };
    const nodeThree = { type: DOM_TYPES.FRAGMENT, children: ["3", "4"] };
    const nodeFour = { type: DOM_TYPES.TEXT };
    expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false);
    expect(areNodesEqual(nodeOne, nodeThree)).toBe(true);
    expect(areNodesEqual(nodeThree, nodeFour)).toBe(false);
  });
  it("testing two elements with same/different tag(s)", () => {
    const nodeOne = { type: DOM_TYPES.ELEMENT, tag: "div" };
    const nodeTwo = { type: DOM_TYPES.ELEMENT, tag: "p", children: ["1"] };
    const nodeThree = { type: DOM_TYPES.ELEMENT, tag: "p", children: ["2"] };
    expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false);
    expect(areNodesEqual(nodeThree, nodeTwo)).toBe(true);
  });
});
