self.onmessage = ({data: {buffer, name}}) => {
  const view = new Int32Array(buffer);
  console.log(`Worker ${name} started`);
  const result = Atomics.wait(view, 0, 0, 1000); // <1>
  console.log(`Worker ${name} awoken with ${result}`);
};
