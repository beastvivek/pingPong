(function () {
  const gameEnd = (table) => {
    const gameOver = document.createElement('div');
    const gameOverTag = table.appendChild(gameOver);
    gameOverTag.id = 'game-over';
    gameOverTag.className = 'game-over';
    gameOver.innerText = 'GAME OVER!!';
  };

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

    inLeftRange(minX, maxX) {
      return (this.#position.x >= minX && this.#position.x <= maxX);
    }

    inRightRange(minX, maxX) {
      return (this.#position.x + this.#size >= minX && this.#position.x + this.#size <= maxX);
    }

    hasHitRacket(minY, maxY) {
      return (this.#position.y + this.#size / 2 >= minY && this.#position.y + this.#size / 2 <= maxY);
    }

    hasHitWall(view, table, intervalId) {
      const { x } = this.#position;
      if (x < view.left || this.#size + x > view.width + view.left) {
        gameEnd(table);
        clearInterval(intervalId);
      }
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

    #moveRacketDown(view) {
      if (this.#position.y + 40 >= view.top + view.height) {
        return;
      }
      this.#position.y = this.#position.y + this.#speed;
    };

    #moveRacketUp(view) {
      if (this.#position.y <= view.top) {
        return;
      }
      this.#position.y = this.#position.y - this.#speed;
    };

    move(event, view) {
      if (event.key === this.#keys.up) {
        this.#moveRacketUp(view);
      }
      if (event.key === this.#keys.down) {
        this.#moveRacketDown(view);
      }
    }

    #checkRightRacket(ball) {
      if (ball.inRightRange(this.#position.x, this.#position.x + this.#size.width)) {
        if (ball.hasHitRacket(this.#position.y, this.#position.y + this.#size.height)) {
          ball.changeDx();
          return true;
        }
      }
    }

    #checkLeftRacket(ball) {
      if (ball.inLeftRange(this.#position.x + this.#size.width, this.#position.x + this.#size.width)) {
        if (ball.hasHitRacket(this.#position.y, this.#position.y + this.#size.height)) {
          ball.changeDx();
          return true;
        }
      }
    }

    hasHitBall(ball) {
      if (this.#id === 'rightRacket') {
        return this.#checkRightRacket(ball);
      }
      return this.#checkLeftRacket(ball);
    }

    getInfo() {
      return {
        id: this.#id,
        position: { x: this.#position.x, y: this.#position.y },
        size: { width: this.#size.width, height: this.#size.height }
      };
    }

  }

  const px = (value) => {
    return value + 'px';
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

  const drawRacket = (table, racket, racketElement) => {
    const racketElements = document.getElementsByClassName('racket');
    if (racketElements.length >= 2) {
      const { position: { y } } = racket.getInfo();
      racketElement.style.top = px(y);
      return;
    }
    const { id, position: { x, y }, size: { width, height } } = racket.getInfo();
    const racketDiv = table.appendChild(document.createElement('div'));
    racketDiv.id = id;
    racketDiv.className = 'racket';
    racketDiv.style.width = px(width);
    racketDiv.style.height = px(height);
    racketDiv.style.top = px(y);
    racketDiv.style.left = px(x);

  };

  const drawGameWindow = (view, table) => {
    const { width, height, top, left } = view;
    table.style.top = px(top);
    table.style.left = px(left);
    table.style.width = px(width);
    table.style.height = px(height);
    table.style.border = `${px(1)} solid black`;
  };

  const createScoreCard = () => {
    const scoreCard = document.createElement('div');
    const body = document.getElementById('body');
    const div = body.appendChild(scoreCard);
    div.className = 'score-card';
    div.style.padding = px(10);
    div.style.width = px(200);
    div.style.height = px(50);
    div.style.textAlign = 'center';
    div.innerText = 0;
    return div;
  };

  const updateScore = (score) => {
    score.innerText = parseInt(score.innerText) + 1;
  };

  const main = () => {
    const view = { top: 200, left: 200, width: 500, height: 200 };
    const middleY = view.height / 2 + view.top;
    const middleX = view.width / 2 + view.left;
    const ball = new Ball('ball', { x: middleX, y: middleY }, 20, { dx: 2, dy: 2 });

    const leftRacket = new Racket('leftRacket', { y: view.top, x: view.left + 2 }, { width: 2, height: 40 }, 10, { up: 'w', down: 's' });
    const rightRacket = new Racket('rightRacket', { y: view.top, x: view.left + view.width - 2 }, { width: 2, height: 40 }, 10, { up: 'ArrowUp', down: 'ArrowDown' });

    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawRacket(table, leftRacket);
    drawRacket(table, rightRacket);
    drawBall(table, ball);
    const score = createScoreCard();

    document.addEventListener('keydown', (event) => {
      leftRacket.move(event, view);
      rightRacket.move(event, view);
    });

    const intervalId = setInterval(() => {
      ball.move(view);
      drawBall(table, ball);
      const leftRacketDiv = document.getElementById('leftRacket');
      const rightRacketDiv = document.getElementById('rightRacket');
      if (leftRacket.hasHitBall(ball) || rightRacket.hasHitBall(ball)) {
        updateScore(score);
      }
      drawRacket(table, leftRacket, leftRacketDiv);
      drawRacket(table, rightRacket, rightRacketDiv);
      ball.hasHitWall(view, table, intervalId);
    }, 20);
  };

  window.onload = main;
})();
