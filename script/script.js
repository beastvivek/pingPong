(function () {
  const px = (value) => value + 'px';

  const endGame = (table, intervalId) => {
    const gameOver = document.createElement('div');
    const gameOverTag = table.appendChild(gameOver);
    gameOverTag.className = 'game-over';
    gameOver.innerText = 'GAME OVER!!';
    clearInterval(intervalId);
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

  const updateBall = (ball) => {
    const { id, position: { x, y } } = ball.getInfo();
    const ballElement = document.getElementById(id);
    ballElement.style.top = px(y);
    ballElement.style.left = px(x);
  };

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

  const updateRacket = (racket) => {
    const { id } = racket.getInfo();
    const racketElement = document.getElementById(id);
    const { position: { y } } = racket.getInfo();
    racketElement.style.top = px(y);
  };

  const drawGameWindow = (view, table) => {
    const { width, height, top, left } = view;
    table.style.top = px(top);
    table.style.left = px(left);
    table.style.width = px(width);
    table.style.height = px(height);
    table.style.border = `${px(1)} solid black`;
  };

  const drawScoreCard = () => {
    const scoreCard = document.createElement('div');
    const body = document.getElementById('body');
    const div = body.appendChild(scoreCard);
    div.className = 'score-card';
    div.id = 'score-card';
    div.innerText = 0;
  };

  const updateScoreCard = (score) => {
    const scoreCard = document.getElementById('score-card');
    scoreCard.innerText = score;
  };

  const controller = (key, view, leftRacket, rightRacket) => {
    if (key === 'w') {
      leftRacket.moveUp(view);
    }
    if (key === 's') {
      leftRacket.moveDown(view);
    }
    if (key === 'ArrowUp') {
      rightRacket.moveUp(view);
    }
    if (key === 'ArrowDown') {
      rightRacket.moveDown(view);
    }
  };

  const createGame = () => {
    const view = { id: 'table', top: 200, left: 200, width: 500, height: 200 };
    const middleY = view.height / 2 + view.top;
    const middleX = view.width / 2 + view.left;
    const ball = new Ball('ball',
      { x: middleX, y: middleY },
      10,
      { dx: 2, dy: 2 });

    const leftRacket = new Racket('leftRacket',
      { y: view.top, x: view.left + 2 },
      { width: 2, height: 40 },
      10);

    const rightRacket = new Racket('rightRacket',
      { y: view.top, x: view.left + view.width - 2 },
      { width: 2, height: 40 },
      10);

    const game = new Game(view, { leftRacket, rightRacket }, ball, 0);

    return game;
  };

  const drawGame = (game) => {
    const { view, ball, rackets: { leftRacket, rightRacket } } = game.getInfo();
    const table = document.getElementById('table');
    drawGameWindow(view, table);
    drawRacket(table, leftRacket);
    drawRacket(table, rightRacket);
    drawBall(table, ball);
    drawScoreCard();
  }

  const main = () => {
    const game = createGame();
    const { view, ball, rackets: { leftRacket, rightRacket } } = game.getInfo();

    document.addEventListener('keydown', (event) => {
      controller(event.key, view, leftRacket, rightRacket);
    });

    drawGame(game);

    const intervalId = setInterval(() => {
      game.update();
      if (game.isOver()) {
        endGame(table, intervalId);
      }
      const { score } = game.getInfo();
      updateScoreCard(score);
      updateBall(ball);
      updateRacket(leftRacket);
      updateRacket(rightRacket);
    }, 20);
  };

  window.onload = main;
})();
