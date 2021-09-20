const ID = Math.floor(Math.random() * 999999); // <1>
console.log('shared-worker.js', ID);

const ports = new Set(); // <2>

self.onconnect = (event) => { // <3>
  const port = event.ports[0];
  ports.add(port);
  console.log('CONN', ID, ports.size);

  port.onmessage = (event) => { // <4>
    console.log('MESSAGE', ID, event.data);

    for (let p of ports) { // <5>
      p.postMessage([ID, event.data]);
    }
  };
};
