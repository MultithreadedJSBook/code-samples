const Piscina = require('piscina');
const crypto = require('crypto');

const big64arr = new BigUint64Array(1)
function random64() {
  crypto.randomFillSync(big64arr);
  return big64arr[0];
}

function sumDigitsSquared(num) {
  let total = 0n;
  while (num > 0) {
    const numModBase = num % 10n;
    total += numModBase ** 2n;
    num = num / 10n;
  }
  return total;
}

function isHappy(num) {
  while (num != 1n && num != 4n) {
    num = sumDigitsSquared(num);
  }
  return num === 1n;
}

function isHappycoin(num) {
  return isHappy(num) && num % 10000n === 0n;
}

const THREAD_COUNT = 4;

if (!Piscina.isWorkerThread) { // <1>
  const piscina = new Piscina({
    filename: __filename, // <2>
    minThreads: THREAD_COUNT, // <3>
    maxThreads: THREAD_COUNT
  })
  let done = 0;
  let count = 0;
  for (let i = 0; i < THREAD_COUNT; i++) { // <4>
    (async () => {
      const { total, happycoins } = await piscina.run() // <5>
      process.stdout.write(happycoins);
      count += total;
      if (++done === THREAD_COUNT) { // <6>
        console.log('\ncount', count);
      }
    })();
  }
}

module.exports = () => {
  let happycoins = '';
  let total = 0;
  for (let i = 0; i < 10_000_000/THREAD_COUNT; i++) { // <1>
    const randomNum = random64();
    if (isHappycoin(randomNum)) {
      happycoins += randomNum.toString() + ' ';
      total++;
    }
  }
  return { total, happycoins }; // <2>
}
