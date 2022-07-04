(function () {
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

    move() {
      this.#position.x += this.#delta.dx;
      this.#position.y += this.#delta.dy;
    }

    getInfo() {
      return {
        id: this.#id,
        position: { x: this.#position.x, y: this.#position.y },
        size: this.#size,
        delta: this.#delta
      };
    };
  }

  const drawBall = (gameWindow, ball) => {
    const { position: { x, y } } = ball.getInfo();
    const ballDiv = gameWindow.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = y + 'px';
    ballDiv.style.bottom = x + 'px';
  };

  const updateBall = (ball) => {
    const { position: { x, y } } = ball.getInfo();
    const ballDiv = document.getElementById('ball');
    ballDiv.style.top = y + 'px';
    ballDiv.style.bottom = x + 'px';
  };

  const main = () => {
    const gameWindow = document.getElementById('game-window');
    const ball = new Ball('ball', { x: 0, y: 0 }, 10, { dx: 2, dy: 2 });

    drawBall(gameWindow, ball);
    ball.move();
    updateBall(ball);
  };

  window.onload = main;
})();
