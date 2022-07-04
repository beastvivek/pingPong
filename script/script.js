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

  const px = (value) => {
    return value + 'px';
  };

  const drawBall = (gameWindow, ball) => {
    const { size, position: { x, y } } = ball.getInfo();
    const ballDiv = gameWindow.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = px(y);
    ballDiv.style.left = px(x);
    ballDiv.style.width = px(size);
  };

  const drawGameWindow = (gameWindow) => {
    gameWindow.style.width = px(500);
    gameWindow.style.height = px(300);
    gameWindow.style.border = `${px(1)} solid black`;
  };

  const updateBall = (ball) => {
    const { position: { x, y } } = ball.getInfo();
    const ballDiv = document.getElementById('ball');
    ballDiv.style.top = px(y);
    ballDiv.style.left = px(x);
  };

  const main = () => {
    const gameWindow = document.getElementById('game-window');
    const ball = new Ball('ball', { x: 0, y: 0 }, 20, { dx: 2, dy: 2 });

    drawBall(gameWindow, ball);
    setInterval(() => {
      drawGameWindow(gameWindow);
      ball.move();
      updateBall(ball);
    }, 30);
  };

  window.onload = main;
})();
