class Ball {
  #id;
  #position;
  #size;
  #delta;

  constructor(id, position, size, delta) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
    this.#delta = delta;
  }

  move(view) {
    const { y } = this.#position;
    if (y < view.top || this.#size + y >= view.height + view.top) {
      this.#delta.dy = -this.#delta.dy;
    }
    this.#position.x += this.#delta.dx;
    this.#position.y += this.#delta.dy;
  }

  changeDx() {
    this.#delta.dx = -this.#delta.dx;
  }

  isInLeftRacketsRange(minX) {
    return (this.#position.x === minX);
  }

  isInRightRacketsRange(minX) {
    return (this.#position.x + this.#size === minX);
  }

  #isInRange(minY, maxY) {
    return (this.#position.y + this.#size / 2 >= minY && this.#position.y + this.#size / 2 <= maxY);
  }

  hasHitWall(view) {
    const { x } = this.#position;
    return x < view.left || this.#size + x > view.width + view.left;
  }

  hasHit(racket) {
    const { position, size } = racket.getInfo();
    const minY = position.y;
    const maxY = position.y + size.height;
    if (this.#isInRange(minY, maxY)) {
      return true;
    }
    return false;
  }

  getInfo() {
    return {
      id: this.#id,
      position: { x: this.#position.x, y: this.#position.y },
      size: this.#size,
      delta: { dx: this.#delta.dx, dy: this.#delta.dy }
    };
  };
}