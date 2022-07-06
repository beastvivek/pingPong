class Game {
  #table;
  #rackets;
  #ball;
  #score;
  constructor(table, rackets, ball, score) {
    this.#table = table;
    this.#rackets = rackets;
    this.#ball = ball;
    this.#score = score;
  }

  #moveBall() {
    this.#ball.move(this.#table);
  }

  #updateOnCollision() {
    for (const racket in this.#rackets) {
      if (this.#haveCollided(this.#rackets[racket])) {
        this.#score++;
        this.#ball.changeDx();
      }
    }
  }

  update() {
    this.#moveBall();
    this.#updateOnCollision();
  }

  isOver() {
    return this.#ball.hasHitWall(this.#table);
  }

  #hasHitRightRacket(rightRacket) {
    const { position } = rightRacket.getInfo();
    if (this.#ball.isInRightRacketsRange(position.x)) {
      return this.#ball.hasHit(rightRacket);
    }
    return false;
  };

  #hasHitLeftRacket(leftRacket) {
    const { position, size } = leftRacket.getInfo();
    if (this.#ball.isInLeftRacketsRange(position.x + size.width)) {
      return this.#ball.hasHit(leftRacket);
    }
    return false;
  };

  #haveCollided(racket) {
    const { id } = racket.getInfo();
    if (id === 'rightRacket') {
      return this.#hasHitRightRacket(this.#rackets.rightRacket);
    }
    return this.#hasHitLeftRacket(this.#rackets.leftRacket);
  };

  getInfo() {
    return {
      table: this.#table,
      score: this.#score,
      ball: this.#ball,
      rackets: {
        leftRacket: this.#rackets.leftRacket,
        rightRacket: this.#rackets.rightRacket
      }
    };
  }
}