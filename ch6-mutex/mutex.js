const UNLOCKED = 0;
const LOCKED = 1;

const {
  compareExchange, wait, notify
} = Atomics;

class Mutex {
  constructor(shared, index) {
    this.shared = shared;
    this.index = index;
  }

  acquire() {
    if (compareExchange(this.shared, this.index, UNLOCKED, LOCKED) === UNLOCKED) {
      return;
    }
    wait(this.shared, this.index, LOCKED);
    this.acquire();
  }

  release() {
    if (compareExchange(this.shared, this.index, LOCKED, UNLOCKED) !== LOCKED) {
      throw new Error('was not acquired');
    }
    notify(this.shared, this.index, 1);
  }

  exec(fn) {
    this.acquire();
    try {
      return fn();
    } finally {
      this.release();
    }
  }
}

module.exports = Mutex;
