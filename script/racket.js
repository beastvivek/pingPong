class Racket {
  #id;
  #position;
  #size;
  #speed;
  #keys;
  constructor(id, position, size, speed, keys) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
    this.#speed = speed;
    this.#keys = keys;
  }

  #moveDown(view) {
    if (this.#position.y + 40 >= view.top + view.height) {
      return;
    }
    this.#position.y = this.#position.y + this.#speed;
  };

  #moveUp(view) {
    if (this.#position.y <= view.top) {
      return;
    }
    this.#position.y = this.#position.y - this.#speed;
  };

  move(event, view) {
    if (event.key === this.#keys.up) {
      this.#moveUp(view);
    }
    if (event.key === this.#keys.down) {
      this.#moveDown(view);
    }
  }

  getInfo() {
    return {
      id: this.#id,
      position: { x: this.#position.x, y: this.#position.y },
      size: { width: this.#size.width, height: this.#size.height }
    };
  }
}