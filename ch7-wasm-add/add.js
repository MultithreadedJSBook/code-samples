const fs = require('fs/promises'); // Needs Node.js v14 or higher.

(async () => {
  const wasm = await fs.readFile('./add.wasm');
  const { instance: { exports: { add } } } = await WebAssembly.instantiate(wasm);
  console.log(add(2, 3));
})();
