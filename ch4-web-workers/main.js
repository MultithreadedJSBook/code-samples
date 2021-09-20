if (!crossOriginIsolated) { // <1>
  throw new Error('Cannot use SharedArrayBuffer');
}

const worker = new Worker('worker.js');

const buffer = new SharedArrayBuffer(1024); // <2>
const view = new Uint8Array(buffer); // <3>

console.log('now', view[0]);

worker.postMessage(buffer);

setTimeout(() => {
  console.log('later', view[0]);
  console.log('prop', buffer.foo); // <4>
}, 500);
