console.log('hello from main.js');

const worker = new Worker('worker.js'); // <1>

worker.onmessage = (msg) => { // <2>
  console.log('message received from worker', msg.data);
};

worker.postMessage('message sent to worker'); // <3>

console.log('hello from end of main.js');
