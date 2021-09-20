class RpcWorker {
  constructor(path) {
    this.next_command_id = 0;
    this.in_flight_commands = new Map();
    this.worker = new Worker(path);
    this.worker.onmessage = this.onMessageHandler.bind(this);
  }
// THIS LINE SHOULD NOT APPEAR IN PRINT
  onMessageHandler(msg) {
    const { result, error, id } = msg.data;
    const { resolve, reject } = this.in_flight_commands.get(id);
    this.in_flight_commands.delete(id);
    if (error) reject(error);
    else resolve(result);
  }
// THIS LINE SHOULD NOT APPEAR IN PRINT
  exec(method, ...args) {
    const id = ++this.next_command_id;
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.in_flight_commands.set(id, { resolve, reject });
    this.worker.postMessage({ method, params: args, id });
    return promise;
  }
}
