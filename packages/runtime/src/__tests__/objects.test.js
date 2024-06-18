import { it, expect, describe } from "vitest";
import { objectsDiff, hasOwnProperty } from "../utils/objects";

describe("Testing objectsDiff function", () => {
  it("same object, no changes were made", () => {
    const oldObj = { foo: "bar" };
    const newObj = { foo: "bar" };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);
    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
  });

  it("key added", () => {
    const oldObj = { foo: "bar" };
    const newObj = { foo: "bar", far: "har" };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);
    expect(added).toEqual(["far"]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
  });

  it("key removed", () => {
    const oldObj = { foo: "bar" };
    const newObj = {};
    const { added, removed, updated } = objectsDiff(oldObj, newObj);
    expect(added).toEqual([]);
    expect(removed).toEqual(["foo"]);
    expect(updated).toEqual([]);
  });

  it("key value updated", () => {
    const oldObj = { foo: "bar", far: "har" };
    const newObj = { foo: "har", far: "bar" };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);
    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual(["foo", "far"]);
  });
});

describe("Testing hasOwnProperty function", () => {
  it("The object has the given property", () => {
    const obj = { foo: "bar", far: "har" };
    expect(hasOwnProperty(obj, "foo")).toBe(true);
    expect(hasOwnProperty(obj, "far")).toBe(true);
  });
  it("The object does not have the given property", () => {
    const obj = {};
    expect(hasOwnProperty(obj, "foo")).toBe(false);
    expect(hasOwnProperty(obj, "far")).toBe(false);
  });
});
