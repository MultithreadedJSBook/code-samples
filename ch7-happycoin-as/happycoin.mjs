import { WASI } from 'wasi'; // <1>
import fs from 'fs/promises';
import loader from '@assemblyscript/loader';
import { Worker, isMainThread, parentPort } from 'worker_threads';

const THREAD_COUNT = 4;

if (isMainThread) {
  let inFlight = THREAD_COUNT;
  let count = 0;
  for (let i = 0; i < THREAD_COUNT; i++) {
    const worker = new Worker(new URL(import.meta.url)); // <2>
    worker.on('message', msg => {
      count += msg.length;
      process.stdout.write(msg.join(' ') + ' ');
      if (--inFlight === 0) {
        process.stdout.write('\ncount ' + count + '\n');
      }
    });
  }
} else {
  const wasi = new WASI();
  const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
  const wasmFile = await fs.readFile('./happycoin.wasm');
  const happycoinModule = await loader.instantiate(wasmFile, importObject);
  wasi.start(happycoinModule);

  const happycoinsWasmArray =
    happycoinModule.exports.getHappycoins(10_000_000/THREAD_COUNT);
  const happycoins = happycoinModule.exports.__getArray(happycoinsWasmArray);
  parentPort.postMessage(happycoins);
}
