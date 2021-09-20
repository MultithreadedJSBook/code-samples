#!/usr/bin/env node

const http = require('http');
const net = require('net');

const [,, web_host, actor_host] = process.argv;
const [web_hostname, web_port] = web_host.split(':');
const [actor_hostname, actor_port] = actor_host.split(':');

let message_id = 0;
let actors = new Set(); // collection of actor handlers
let messages = new Map(); // message ID -> HTTP response
// THIS TEXT SHOULD NOT APPEAR IN BOOK
net.createServer((client) => {
  const handler = data => client.write(JSON.stringify(data) + '\0'); // <1>
  actors.add(handler);
  console.log('actor pool connected', actors.size);
  client.on('end', () => {
    actors.delete(handler); // <2>
    console.log('actor pool disconnected', actors.size);
  }).on('data', (raw_data) => {
    const chunks = String(raw_data).split('\0'); // <3>
    chunks.pop(); // <4>
    for (let chunk of chunks) {
      const data = JSON.parse(chunk);
      const res = messages.get(data.id);
      res.end(JSON.stringify(data) + '\0');
      messages.delete(data.id);
    }
  });
}).listen(actor_port, actor_hostname, () => {
  console.log(`actor: tcp://${actor_hostname}:${actor_port}`);
});
// THIS TEXT SHOULD NOT APPEAR IN BOOK
http.createServer(async (req, res) => {
  message_id++;
  if (actors.size === 0) return res.end('ERROR: EMPTY ACTOR POOL');
  const actor = randomActor();
  messages.set(message_id, res);
  actor({
    id: message_id,
    method: 'square_sum',
    args: [Number(req.url.substr(1))]
  });
}).listen(web_port, web_hostname, () => {
  console.log(`web:   http://${web_hostname}:${web_port}`);
});
// THIS TEXT SHOULD NOT APPEAR IN BOOK
function randomActor() {
  const pool = Array.from(actors);
  return pool[Math.floor(Math.random() * pool.length)];
}

// PART TWO BEGINS BELOW. THIS TEXT SHOULD NOT APPEAR IN BOOK
const RpcWorkerPool = require('./rpc-worker.js');
const worker = new RpcWorkerPool('./worker.js', 4, 'leastbusy');
actors.add(async (data) => {
  const value = await worker.exec(data.method, ...data.args);
  messages.get(data.id).end(JSON.stringify({
    id: data.id,
    value,
    pid: 'server'
  }) + '\0');
  messages.delete(data.id);
});
