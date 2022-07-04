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

  const drawBall = (table, ball) => {
    const { size, position: { x, y } } = ball.getInfo();
    const ballDiv = table.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = px(table.top);
    ballDiv.style.left = px(table.left);
    ballDiv.style.width = px(size);
  };

  const drawLeftRacket = (view, table) => {
    const { width, height, top, left } = view;
    const racketDiv = table.appendChild(document.createElement('div'));
    racketDiv.id = 'racket-1';
    racketDiv.className = 'racket';
    racketDiv.style.top = px(top);
    racketDiv.style.left = px(left);
    racketDiv.style.width = px(5);
    racketDiv.style.height = px(40);
  };

  const drawRightRacket = (view, table) => {
    const { width, height, top, left } = view;
    const racketDiv = table.appendChild(document.createElement('div'));
    racketDiv.id = 'racket-2';
    racketDiv.className = 'racket';
    racketDiv.style.width = px(5);
    racketDiv.style.height = px(40);
    racketDiv.style.top = px(top + height - 39);
    racketDiv.style.left = px(left + width - 4);
  };

  const drawGameWindow = (view, table) => {
    const { width, height, top, left } = view;
    table.style.top = px(top);
    table.style.left = px(left);
    table.style.width = px(width);
    table.style.height = px(height);
    table.style.border = `${px(1)} solid black`;
  };

  const updateBall = (ball) => {
    const { position: { x, y } } = ball.getInfo();
    const ballDiv = document.getElementById('ball');
    ballDiv.style.top = px(y);
    ballDiv.style.left = px(x);
  };

  const main = () => {
    const view = { top: 100, left: 100, width: 500, height: 300 };
    const ball = new Ball('ball', { x: 100, y: 100 }, 20, { dx: 2, dy: 2 });

    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawLeftRacket(view, table);
    drawRightRacket(view, table);
    drawBall(table, ball);
    setInterval(() => {
      ball.move(view);
      updateBall(ball);
    }, 30);
  };

  window.onload = main;
})();
