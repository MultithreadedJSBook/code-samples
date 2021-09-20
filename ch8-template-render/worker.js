const { parentPort } = require('worker_threads');
const template = require('./template.js');

function asyncOnMessageWrap(fn) {
  return async function(msg) {
    parentPort.postMessage(await fn(msg));
  }
}

const commands = {
  renderLove: (data) => template.renderLove(data)
};

parentPort.on('message', asyncOnMessageWrap(async ({ method, params, id }) => ({
  result: await commands[method](...params), id
})));
