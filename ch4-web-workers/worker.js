self.onmessage = ({data: buffer}) => {
  buffer.foo = 42; // <1>
  const view = new Uint8Array(buffer);
  view[0] = 2; // <2>
  console.log('updated in worker');
};
