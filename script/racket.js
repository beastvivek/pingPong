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

  moveDown(view) {
    if (this.#position.y + this.#size.height >= view.top + view.height) {
      return;
    }
    this.#position.y = this.#position.y + this.#speed;
  };

  moveUp(view) {
    if (this.#position.y <= view.top) {
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