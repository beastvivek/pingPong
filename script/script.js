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

    move(view) {
      const { x, y } = this.#position;
      if (x < 0 || this.#size + x >= view.width) {
        this.#delta.dx = -this.#delta.dx;
      }
      if (y < 0 || this.#size + y >= view.height) {
        this.#delta.dy = -this.#delta.dy;
      }
      this.#position.x += this.#delta.dx;
      this.#position.y += this.#delta.dy;
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

  const px = (value) => {
    return value + 'px';
  };

  const drawBall = (game, ball) => {
    const { size, position: { x, y } } = ball.getInfo();
    const ballDiv = game.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = px(y);
    ballDiv.style.left = px(x);
    ballDiv.style.width = px(size);
  };

  const drawGameWindow = (view) => {
    const { width, height } = view;
    const gameDiv = document.getElementById('game-window');
    gameDiv.style.width = px(width);
    gameDiv.style.height = px(height);
    gameDiv.style.border = `${px(1)} solid black`;
  };

  const updateBall = (ball) => {
    const { position: { x, y } } = ball.getInfo();
    const ballDiv = document.getElementById('ball');
    ballDiv.style.top = px(y);
    ballDiv.style.left = px(x);
  };

  const main = () => {
    const view = { width: 500, height: 300 };
    const ball = new Ball('ball', { x: 0, y: 0 }, 20, { dx: 2, dy: 2 });

    const game = document.getElementById('game-window');
    drawGameWindow(view);
    drawBall(game, ball);
    setInterval(() => {
      ball.move(view);
      updateBall(ball);
    }, 30);
  };

  window.onload = main;
})();
