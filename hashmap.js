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
  set(key, value) {
    const hashKey = this.hash(key);

    if(this.hashBuckets[hashKey] === undefined) {
      this.hashBuckets[hashKey] = new Node(key, value);
      this.entryCount++;
      return;
    }

    let currNode = this.hashBuckets[hashKey];

    while(true) {
      if(currNode.key === key) {
        currNode.value = value;
        break;
      }else if(currNode.nextNode !== null){
        currNode = currNode.nextNode;
      }else {
        currNode.nextNode = new Node(key, value);
        this.entryCount++;
        break;
      }
    }
  }
  get(key){
    const hashKey = this.hash(key);

    if(this.hashBuckets[hashKey] === undefined) {
      return undefined;
    }

    let currNode = this.hashBuckets[hashKey];

    while(true) {
      if(currNode.key === key) {
        return currNode.value;
      }else if(currNode.nextNode !== null){
        currNode = currNode.nextNode;
      }else {
        return undefined;
      }
    }
  }
  has(key){
    const hashKey = this.hash(key);

    if(this.hashBuckets[hashKey] === undefined) {
      return false;
    }

    let currNode = this.hashBuckets[hashKey];

    while(true) {
      if(currNode.key === key) {
        return true;
      }else if(currNode.nextNode !== null){
        currNode = currNode.nextNode;
      }else {
        return false;
      }
    }
  }
  length(){
    return this.entryCount;
  }
  remove(key){
    const hashKey = this.hash(key);

    if(this.hashBuckets[hashKey] === undefined) {
      return false;
    }

    let currNode = this.hashBuckets[hashKey];
    let lastNode = null;

    while(true) {
      if(currNode.key === key) {
        if(lastNode === null){
          if (currNode.nextNode !== null) {
            this.hashBuckets[hashKey] = currNode.nextNode; 
          }else {
            this.hashBuckets[hashKey] = undefined;
          }
        }else{
          if(currNode.nextNode === null){
            lastNode.nextNode = null;
          }else{
            lastNode.nextNode = currNode.nextNode;
          }
        }
        this.entryCount--;
        return true;
      }else if(currNode.nextNode !== null){
        lastNode = currNode;
        currNode = currNode.nextNode;
      }else {
        return false;
      }
    }
  }
  clear(){
    this.hashBuckets = new Array(16);
    this.entryCount = 0;
  }
  keys(){
    const keyArr = [];
    for (const node of this.hashBuckets) {
      if(node === undefined){
        continue;
      }
      let currNode = node;
      while(true){
        keyArr.push(currNode.key);

        if(currNode.nextNode === null){
          break;
        }
        currNode = currNode.nextNode;
      }
    }
    return keyArr;
  }
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.nextNode = null;
  }
}
