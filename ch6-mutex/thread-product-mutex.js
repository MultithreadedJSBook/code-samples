const {
  Worker, isMainThread, workerData
} = require('worker_threads');
const assert = require('assert');
const Mutex = require('./mutex.js');

if (isMainThread) {
  const shared = new SharedArrayBuffer(4 * 5);
  const sharedInts = new Int32Array(shared);
  sharedInts.set([2, 3, 5, 7, 0]);
  for (let i = 0; i < 3; i++) {
    new Worker(__filename, { workerData: { i, shared } });
  }
} else {
  const { i, shared } = workerData;
  const sharedInts = new Int32Array(shared);
  const mutex = new Mutex(sharedInts, 4); // <1>
  mutex.exec(() => {
    const a = sharedInts[i]; // <2>
    for (let j = 0; j < 1000000; j++) {}
    const b = sharedInts[3];
    sharedInts[3] = a * b;
    assert.strictEqual(sharedInts[3], a * b);
  });
}
