console.log('red.js');

const worker = new SharedWorker('shared-worker.js'); // <1>

worker.port.onmessage = (event) => { // <2>
  console.log('EVENT', event.data);
};
