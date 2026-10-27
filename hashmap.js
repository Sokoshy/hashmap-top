// File to complete: implement your HashMap here.
// Constraints to respect (reminder, no solution):
// - initial capacity 16, load factor 0.75
// - handle collisions without overwriting different keys
// - double capacity growth when the threshold is exceeded
// - insertion order does not need to be preserved
// This file should only export your HashMap, you choose class or factory.

export class HashMap {
  constructor() {
    this.hashBuckets = new Array(16);
    this.loadFactor = 0.75;
    this.capacity = 16;
    this.entryCount = 0;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }
}
