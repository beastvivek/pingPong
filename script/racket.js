class Racket {
  #id;
  #position;
  #size;
  #speed;
  constructor(id, position, size, speed) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
    this.#speed = speed;
  }

  moveDown(table) {
    if (this.#position.y + this.#size.height >= table.top + table.height) {
      return;
    }
    this.#position.y = this.#position.y + this.#speed;
  };

  moveUp(table) {
    if (this.#position.y <= table.top) {
      return;
    }
    this.#position.y = this.#position.y - this.#speed;
  };

  getInfo() {
    return {
      id: this.#id,
      position: { x: this.#position.x, y: this.#position.y },
      size: { width: this.#size.width, height: this.#size.height }
    };
  }
}