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

    isInLeftRacketsRange(minX) {
      return (this.#position.x === minX);
    }

    isInRightRacketsRange(minX) {
      return (this.#position.x + this.#size === minX);
    }

    hasHitRacket(minY, maxY) {
      return (this.#position.y + this.#size / 2 >= minY && this.#position.y + this.#size / 2 <= maxY);
    }

    hasHitWall(view) {
      const { x } = this.#position;
      return x < view.left || this.#size + x > view.width + view.left;
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
      if (ball.isInRightRacketsRange(this.#position.x)) {
        const minY = this.#position.y;
        const maxY = this.#position.y + this.#size.height;
        if (ball.hasHitRacket(minY, maxY)) {
          ball.changeDx();
          return true;
        }
      }
    }

    #checkLeftRacket(ball) {
      if (ball.isInLeftRacketsRange(this.#position.x + this.#size.width)) {
        const minY = this.#position.y;
        const maxY = this.#position.y + this.#size.height;
        if (ball.hasHitRacket(minY, maxY)) {
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

  const endGame = (table, intervalId) => {
    const gameOver = document.createElement('div');
    const gameOverTag = table.appendChild(gameOver);
    gameOverTag.className = 'game-over';
    gameOver.innerText = 'GAME OVER!!';
    clearInterval(intervalId);
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
    div.innerText = 0;
    return div;
  };

  const hasCollided = (racket, ball) => {
    return racket.hasHitBall(ball);
  };

  const updateScore = (score, leftRacket, rightRacket, ball) => {
    if (hasCollided(leftRacket, ball) || hasCollided(rightRacket, ball)) {
      score++;
    }
    return score;
  };

  const drawScoreCard = (scoreCard, score) => {
    scoreCard.innerText = score;
  };

  const main = () => {
    const view = { top: 200, left: 200, width: 500, height: 200 };
    const middleY = view.height / 2 + view.top;
    const middleX = view.width / 2 + view.left;
    const ball = new Ball('ball',
      { x: middleX, y: middleY },
      20,
      { dx: 2, dy: 2 });

    const leftRacket = new Racket('leftRacket',
      { y: view.top, x: view.left + 2 },
      { width: 2, height: 40 },
      10,
      { up: 'w', down: 's' });

    const rightRacket = new Racket('rightRacket',
      { y: view.top, x: view.left + view.width - 2 },
      { width: 2, height: 40 },
      10,
      { up: 'ArrowUp', down: 'ArrowDown' });

    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawRacket(table, leftRacket);
    drawRacket(table, rightRacket);
    drawBall(table, ball);

    const scoreCard = createScoreCard();
    let score = 0;

    document.addEventListener('keydown', (event) => {
      leftRacket.move(event, view);
      rightRacket.move(event, view);
    });

    const leftRacketDiv = document.getElementById('leftRacket');
    const rightRacketDiv = document.getElementById('rightRacket');

    const intervalId = setInterval(() => {
      ball.move(view);
      score = updateScore(score, leftRacket, rightRacket, ball);
      if (ball.hasHitWall(view)) {
        endGame(table, intervalId);
      }
      drawScoreCard(scoreCard, score);
      drawBall(table, ball);
      drawRacket(table, leftRacket, leftRacketDiv);
      drawRacket(table, rightRacket, rightRacketDiv);
    }, 20);
  };

  window.onload = main;
})();
