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

    #isInRange(minY, maxY) {
      return (this.#position.y + this.#size / 2 >= minY && this.#position.y + this.#size / 2 <= maxY);
    }

    hasHitWall(view) {
      const { x } = this.#position;
      return x < view.left || this.#size + x > view.width + view.left;
    }

    hasHit(racket) {
      const { position, size } = racket.getInfo();
      const minY = position.y;
      const maxY = position.y + size.height;
      if (this.#isInRange(minY, maxY)) {
        return true;
      }
      return false;
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

    #moveDown(view) {
      if (this.#position.y + 40 >= view.top + view.height) {
        return;
      }
      this.#position.y = this.#position.y + this.#speed;
    };

    #moveUp(view) {
      if (this.#position.y <= view.top) {
        return;
      }
      this.#position.y = this.#position.y - this.#speed;
    };

    move(event, view) {
      if (event.key === this.#keys.up) {
        this.#moveUp(view);
      }
      if (event.key === this.#keys.down) {
        this.#moveDown(view);
      }
    }

    getInfo() {
      return {
        id: this.#id,
        position: { x: this.#position.x, y: this.#position.y },
        size: { width: this.#size.width, height: this.#size.height }
      };
    }
  }

  const hasHitRightRacket = (racket, ball) => {
    const { position } = racket.getInfo();
    if (ball.isInRightRacketsRange(position.x)) {
      return ball.hasHit(racket);
    }
    return false;
  };

  const hasHitLeftRacket = (racket, ball) => {
    const { position, size } = racket.getInfo();
    if (ball.isInLeftRacketsRange(position.x + size.width)) {
      return ball.hasHit(racket);
    }
    return false;
  };

  const haveCollided = (racket, ball) => {
    const { id } = racket.getInfo();
    if (id === 'rightRacket') {
      return hasHitRightRacket(racket, ball);
    }
    return hasHitLeftRacket(racket, ball);
  };

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

  const updateBall = (ball) => {
    const { id, position: { x, y } } = ball.getInfo();
    const ballElement = document.getElementById(id);
    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
  };

  const drawBall = (table, ball) => {
    const { size } = ball.getInfo();
    const ballDiv = table.appendChild(document.createElement('div'));
    ballDiv.id = 'ball';
    ballDiv.className = 'ball';
    ballDiv.style.top = px(table.top);
    ballDiv.style.left = px(table.left);
    ballDiv.style.width = px(size);
  };

  const updateRacket = (racket) => {
    const { id } = racket.getInfo();
    const racketElement = document.getElementById(id);
    const { position: { y } } = racket.getInfo();
    racketElement.style.top = px(y);
  }

  const drawRacket = (table, racket) => {
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

  const drawScoreCard = (scoreCard, score) => {
    scoreCard.innerText = score;
  };

  const addEventListeners = (view, leftRacket, rightRacket) => {
    document.addEventListener('keydown', (event) => {
      leftRacket.move(event, view);
      rightRacket.move(event, view);
    });
  };

  const createObjects = () => {
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

    return { view, leftRacket, rightRacket, ball };
  };

  const main = () => {
    const { view, leftRacket, rightRacket, ball } = createObjects();

    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawRacket(table, leftRacket);
    drawRacket(table, rightRacket);
    drawBall(table, ball);

    addEventListeners(view, leftRacket, rightRacket);

    const scoreCard = createScoreCard();
    let score = 0;

    const intervalId = setInterval(() => {
      ball.move(view);
      if (haveCollided(leftRacket, ball) || haveCollided(rightRacket, ball)) {
        score++;
        ball.changeDx();
      }
      if (ball.hasHitWall(view)) {
        endGame(table, intervalId);
      }
      drawScoreCard(scoreCard, score);
      updateBall(ball);
      updateRacket(leftRacket);
      updateRacket(rightRacket);
    }, 20);
  };

  window.onload = main;
})();
