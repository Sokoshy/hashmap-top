import { describe, it, beforeEach, expect } from "bun:test";
import { HashMap } from "./hashmap.js";

function createMap() {
  try {
    return new HashMap();
  } catch {
    // Also supports a HashMap() factory function without `new`
    return HashMap();
  }
}

describe("HashMap - basic set / get / has", () => {
  let map;
  beforeEach(() => {
    map = createMap();
  });

  it("get returns undefined for a missing key", () => {
    expect(map.get("unknown")).toBe(undefined);
  });

  it("has returns false for a missing key", () => {
    expect(map.has("unknown")).toBe(false);
  });

  it("set then get / has retrieve the value", () => {
    map.set("apple", "red");
    expect(map.get("apple")).toBe("red");
    expect(map.has("apple")).toBe(true);
  });

  it("set overwrites the value without creating a duplicate", () => {
    map.set("apple", "red");
    const before = map.length();
    map.set("apple", "green");
    expect(map.get("apple")).toBe("green");
    expect(map.length()).toBe(before);
  });
});

describe("HashMap - length / remove / clear", () => {
  let map;
  beforeEach(() => {
    map = createMap();
  });

  it("length counts stored keys", () => {
    expect(map.length()).toBe(0);
    map.set("a", "1");
    map.set("b", "2");
    expect(map.length()).toBe(2);
  });

  it("remove deletes and returns true, then false if missing", () => {
    map.set("apple", "red");
    expect(map.remove("apple")).toBe(true);
    expect(map.has("apple")).toBe(false);
    expect(map.get("apple")).toBe(undefined);
    expect(map.remove("apple")).toBe(false);
  });

  it("remove does not change length if key is missing", () => {
    map.set("a", "1");
    const before = map.length();
    expect(map.remove("nope")).toBe(false);
    expect(map.length()).toBe(before);
  });

  it("clear empties the map", () => {
    map.set("a", "1");
    map.set("b", "2");
    map.clear();
    expect(map.length()).toBe(0);
    expect(map.get("a")).toBe(undefined);
    expect(map.keys()).toEqual([]);
  });
});

describe("HashMap - keys / values / entries", () => {
  let map;
  beforeEach(() => {
    map = createMap();
    map.set("apple", "red");
    map.set("banana", "yellow");
    map.set("carrot", "orange");
  });

  it("keys returns all keys", () => {
    expect([...map.keys()].sort()).toEqual(["apple", "banana", "carrot"]);
  });

  it("values returns all values", () => {
    expect([...map.values()].sort()).toEqual(["orange", "red", "yellow"]);
  });

  it("entries returns [key, value] pairs", () => {
    const entries = new Map(map.entries());
    expect(entries.get("apple")).toBe("red");
    expect(entries.get("banana")).toBe("yellow");
    expect(entries.get("carrot")).toBe("orange");
    expect(entries.size).toBe(3);
  });
});

describe("HashMap - The Odin Project scenario", () => {
  it("12 entries then overwrite then 13th entry (moon) without loss", () => {
    const hashMap = createMap();

    hashMap.set("apple", "red");
    hashMap.set("banana", "yellow");
    hashMap.set("carrot", "orange");
    hashMap.set("dog", "brown");
    hashMap.set("elephant", "gray");
    hashMap.set("frog", "green");
    hashMap.set("grape", "purple");
    hashMap.set("hat", "black");
    hashMap.set("ice cream", "white");
    hashMap.set("jacket", "blue");
    hashMap.set("kite", "pink");
    hashMap.set("lion", "golden");

    expect(hashMap.length()).toBe(12);

    // Overwrite without adding new keys
    hashMap.set("apple", "RED");
    hashMap.set("banana", "YELLOW");
    expect(hashMap.length()).toBe(12);
    expect(hashMap.get("apple")).toBe("RED");
    expect(hashMap.get("banana")).toBe("YELLOW");

    // 13th entry: triggers growth
    hashMap.set("moon", "silver");
    expect(hashMap.length()).toBe(13);

    // Everything must stay accessible after growth
    expect(hashMap.get("apple")).toBe("RED");
    expect(hashMap.get("moon")).toBe("silver");
    expect(hashMap.has("lion")).toBe(true);

    // Overwrite after growth
    hashMap.set("moon", "SILVER");
    expect(hashMap.get("moon")).toBe("SILVER");
    expect(hashMap.length()).toBe(13);

    // Other methods still work after growth
    expect(hashMap.keys().length).toBe(13);
    expect(hashMap.values().length).toBe(13);
    expect(hashMap.entries().length).toBe(13);

    expect(hashMap.remove("moon")).toBe(true);
    expect(hashMap.length()).toBe(12);
    expect(hashMap.has("moon")).toBe(false);
  });
});

describe("HashMap - collision and growth robustness", () => {
  it("many keys stay accessible (possible collisions)", () => {
    const map = createMap();
    const pairs = [];
    for (let i = 0; i < 50; i++) {
      pairs.push([`key${i}`, `value${i}`]);
    }
    for (const [key, value] of pairs) map.set(key, value);

    expect(map.length()).toBe(50);
    for (const [key, value] of pairs) {
      expect(map.get(key)).toBe(value);
      expect(map.has(key)).toBe(true);
    }
  });

  it("different keys in the same bucket do not overwrite each other", () => {
    const map = createMap();
    map.set("Rama", "1");
    map.set("Sita", "2");
    // Both must coexist even on collision
    expect(map.get("Rama")).toBe("1");
    expect(map.get("Sita")).toBe("2");
    // length must count 2 distinct keys
    expect(map.length() >= 2).toBe(true);
  });
});
