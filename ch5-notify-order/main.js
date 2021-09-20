if (!crossOriginIsolated) throw new Error('Cannot use SharedArrayBuffer');

const buffer = new SharedArrayBuffer(4);
const view = new Int32Array(buffer);

for (let i = 0; i < 4; i++) { // <1>
  const worker = new Worker('worker.js');
  worker.postMessage({buffer, name: i});
}

setTimeout(() => {
  Atomics.notify(view, 0, 3); // <2>
}, 500); // <3>
