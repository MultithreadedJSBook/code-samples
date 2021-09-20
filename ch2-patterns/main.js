const worker = new RpcWorker('worker.js');

Promise.allSettled([
  worker.exec('square_sum', 1_000_000),
  worker.exec('fibonacci', 1_000),
  worker.exec('fake_method'),
  worker.exec('bad'),
]).then(([square_sum, fibonacci, fake, bad]) => {
  console.log('square sum', square_sum);
  console.log('fibonacci', fibonacci);
  console.log('fake', fake);
  console.log('bad', bad);
});
