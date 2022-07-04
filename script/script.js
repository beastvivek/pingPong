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
      if (x < view.left || this.#size + x >= view.width + view.left) {
        this.#delta.dx = -this.#delta.dx;
      }
      if (y < view.top || this.#size + y >= view.height + view.top) {
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

  const moveRacketDown = (racketDiv, racket, view) => {
    if (racket.top + 40 >= view.top + view.height) {
      return;
    }
    racket.top = racket.top + 5;
    racketDiv.style.top = px(racket.top);
  };

  const moveRacketUp = (racketDiv, racket, view) => {
    if (racket.top <= view.top) {
      return;
    }
    racket.top = racket.top - 5;
    racketDiv.style.top = px(racket.top);
  };

  const moveLeftRacket = (event, leftRacketDiv, leftRacket, view) => {
    if (event.key === 'w') {
      moveRacketUp(leftRacketDiv, leftRacket, view);
    }
    if (event.key === 's') {
      moveRacketDown(leftRacketDiv, leftRacket, view);
    }
  };

  const moveRightRacket = (event, rightRacketDiv, rightRacket, view) => {
    if (event.key === 'ArrowUp') {
      moveRacketUp(rightRacketDiv, rightRacket, view);
    }
    if (event.key === 'ArrowDown') {
      moveRacketDown(rightRacketDiv, rightRacket, view);
    }
  };

  const drawBall = (table, ball) => {
    const ballElement = document.getElementById('ball');
    if (ballElement) {
      const { position: { x, y } } = ball.getInfo();
      ballElement.style.top = px(y);
      ballElement.style.left = px(x);
      return;
    }
    const { size } = ball.getInfo();
    const ballDiv = table.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = px(table.top);
    ballDiv.style.left = px(table.left);
    ballDiv.style.width = px(size);
  };

  const drawRacket = (table, racket) => {
    const racketDiv = table.appendChild(document.createElement('div'));
    racketDiv.id = racket.id;
    racketDiv.className = 'racket';
    racketDiv.style.width = px(5);
    racketDiv.style.height = px(40);
    racketDiv.style.top = px(racket.top);
    racketDiv.style.left = px(racket.left);
  };

  const drawGameWindow = (view, table) => {
    const { width, height, top, left } = view;
    table.style.top = px(top);
    table.style.left = px(left);
    table.style.width = px(width);
    table.style.height = px(height);
    table.style.border = `${px(1)} solid black`;
  };

  const main = () => {
    const view = { top: 200, left: 200, width: 1000, height: 300 };
    const ball = new Ball('ball', { x: view.left, y: view.top }, 20, { dx: 2, dy: 2 });
    const leftRacket = { id: 'leftRacket', top: view.top, left: view.left };
    const rightRacket = { id: 'rightRacket', top: view.top, left: view.left + view.width - 4 };

    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawRacket(table, leftRacket);
    drawRacket(table, rightRacket);
    drawBall(table, ball);

    const leftRacketDiv = document.getElementById('leftRacket');
    const rightRacketDiv = document.getElementById('rightRacket');
    document.addEventListener('keydown', (event) => {
      moveLeftRacket(event, leftRacketDiv, leftRacket, view);
      moveRightRacket(event, rightRacketDiv, rightRacket, view);
    });

    setInterval(() => {
      ball.move(view);
      drawBall(table, ball);
    }, 30);
  };

  window.onload = main;
})();
