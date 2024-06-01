export const ARRAY_DIFF_OP = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop",
};

class ArrayWithOriginalIndices {
  #array = [];
  #originalIndices = [];
  #equalsFn; // For objects' deep comparison

  constructor(array, equalsFn) {
    this.#array = [...array];
    this.#originalIndices = array.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  originalIndexAt(index) {
    return this.#originalIndices[index];
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i;
      }
    }
    return -1;
  }

  // ======== array comparisons =======

  // check if the old item in the new array
  isRemoval(index, newArray) {
    if (index >= this.length) return false;

    const item = this.#array[index];
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.#equalsFn(item, newItem),
    );
    return indexInNewArray === -1;
  }

  // at a given index, check if the item equals in both arrays
  isNoop(index, newArray) {
    if (index >= this.length) return false;

    const item = this.#array[index];
    const newItem = newArray[index];
    return this.#equalsFn(item, newItem);
  }

  // check if the item is newly added
  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1;
  }

  // ======== array operations ========

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    };
    this.#array.splice(index, 1);
    this.#originalIndices.splice(index, 1);

    return operation;
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index],
    };
  }

  addItem(item, index) {
    const operation = { op: ARRAY_DIFF_OP.ADD, index, item };
    this.#array.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1); // Add a -1 to indicate a newly added item

    return operation;
  }

  moveItem(item, toIndex) {
    // due to the algo.'s sequential modification method, the fromIndex must be appears after toIndex
    const fromIndex = this.findIndexFrom(item, toIndex);
    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      to: toIndex,
      item: this.#array[fromIndex],
    };
    // swap items' positions
    const [_item] = this.#array.splice(fromIndex, 1);
    this.#array.splice(toIndex, 0, _item);
    // swap indicies' positions
    const [originalIndx] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndx);

    return operation;
  }

  removeItemsAfter(index) {
    const operations = [];
    while (this.length > index) {
      operations.push(this.removeItem(index));
    }
    return operations;
  }
}

export function withoutNulls(arr) {
  return arr.filter((item) => item !== null && item !== undefined);
}

// This function cannot handle duplicated items. Will modify in the future
export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
  };
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b,
) {
  const sequence = []; // the modification sequence
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);
  for (let index = 0; index < newArray.length; index++) {
    // removal case
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index));
      index--; // cancel out the index increment
      continue;
    }
    // noop case
    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index));
      continue;
    }
    // addition case
    const item = newArray[index];
    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index));
      continue;
    }
    // move case
    sequence.push(array.moveItem(item, index));
  }
  // remove extra items
  sequence.push(...array.removeItemsAfter(newArray.length));

  return sequence;
}
