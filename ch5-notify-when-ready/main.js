if (!crossOriginIsolated) throw new Error('Cannot use SharedArrayBuffer');

const buffer = new SharedArrayBuffer(4);
const view = new Int32Array(buffer);
const now = Date.now();
let count = 4;

for (let i = 0; i < 4; i++) { // <1>
  const worker = new Worker('worker.js');
  worker.postMessage({buffer, name: i}); // <2>
  worker.onmessage = () => {
    console.log(`Ready; id=${i}, count=${--count}, time=${Date.now() - now}ms`);
    if (count === 0) { // <3>
      Atomics.notify(view, 0);
    }
  };
}
