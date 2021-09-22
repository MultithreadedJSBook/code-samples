const http = require('http');
const cluster = require('cluster'); // <1>

if (cluster.isPrimary) { // <2>
  cluster.fork(); // <3>
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  http.createServer((req, res) => {
    res.end('Hello, World!\n');
  }).listen(3000); // <4>
}
