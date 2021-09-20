const buffer = new ArrayBuffer(1);
const view = new Uint8Array(buffer);
function setBool(slot, value) {
  view[0] = (view[0] & ~(1 << slot)) | ((value|0) << slot);
}
function getBool(slot) {
  return !((view[0] & (1 << slot)) === 0);
}
// THIS SHOULD NOT APPEAR IN PRINT

console.log(view[0]); // 0
setBool(0, true);
console.log(view[0]); // 1
setBool(1, true);
console.log(view[0]); // 3
setBool(0, false);
console.log(view[0]); // 2

console.log(getBool(0)); // false
console.log(getBool(1)); // true
console.log(getBool(2)); // false

setBool(7, true);
console.log(view[0]); // 130
