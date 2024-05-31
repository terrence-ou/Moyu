import { test, expect } from "vitest";
import { objectsDiff } from "../utils/objects";

test("same object, no changes were made", () => {
  const oldObj = { foo: "bar" };
  const newObj = { foo: "bar" };
  const { added, removed, updated } = objectsDiff(oldObj, newObj);
  expect(added).toEqual([]);
  expect(removed).toEqual([]);
  expect(updated).toEqual([]);
});

test("key added", () => {
  const oldObj = { foo: "bar" };
  const newObj = { foo: "bar", far: "har" };
  const { added, removed, updated } = objectsDiff(oldObj, newObj);
  expect(added).toEqual(["far"]);
  expect(removed).toEqual([]);
  expect(updated).toEqual([]);
});

test("key removed", () => {
  const oldObj = { foo: "bar" };
  const newObj = {};
  const { added, removed, updated } = objectsDiff(oldObj, newObj);
  expect(added).toEqual([]);
  expect(removed).toEqual(["foo"]);
  expect(updated).toEqual([]);
});

test("key value updated", () => {
  const oldObj = { foo: "bar", far: "har" };
  const newObj = { foo: "har", far: "bar" };
  const { added, removed, updated } = objectsDiff(oldObj, newObj);
  expect(added).toEqual([]);
  expect(removed).toEqual([]);
  expect(updated).toEqual(["foo", "far"]);
});
