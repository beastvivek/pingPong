(function () {
  const endGame = (intervalId) => {
    const body = document.getElementById('body');
    const gameOver = document.createElement('div');
    const gameOverTag = body.appendChild(gameOver);
    gameOverTag.className = 'game-over';
    gameOver.innerText = 'GAME OVER!!';
    clearInterval(intervalId);
  };

  const px = (value) => value + 'px';

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

  const drawGameWindow = (table, tableDiv) => {
    const { width, height, top, left } = table;
    tableDiv.style.top = px(top);
    tableDiv.style.left = px(left);
    tableDiv.style.width = px(width);
    tableDiv.style.height = px(height);
    tableDiv.style.border = `${px(1)} solid black`;
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

  const controller = (key, table, leftRacket, rightRacket) => {
    if (key === 'w') {
      leftRacket.moveUp(table);
    }
    if (key === 's') {
      leftRacket.moveDown(table);
    }
    if (key === 'ArrowUp') {
      rightRacket.moveUp(table);
    }
    if (key === 'ArrowDown') {
      rightRacket.moveDown(table);
    }
  };

  const drawView = (game) => {
    const { table, ball, rackets: { leftRacket, rightRacket } } = game.getInfo();
    const tableDiv = document.getElementById('table');
    drawGameWindow(table, tableDiv);
    drawRacket(tableDiv, leftRacket);
    drawRacket(tableDiv, rightRacket);
    drawBall(tableDiv, ball);
    drawScoreCard();
  };

  const updateView = (game) => {
    const { ball, rackets: { leftRacket, rightRacket }, score } = game.getInfo();
    updateScoreCard(score);
    updateBall(ball);
    updateRacket(leftRacket);
    updateRacket(rightRacket);
  };

  const createGame = () => {
    const table = { id: 'table', top: 200, left: 200, width: 500, height: 200 };
    const middleY = table.height / 2 + table.top;
    const middleX = table.width / 2 + table.left;
    const ball = new Ball('ball',
      { x: middleX, y: middleY },
      10,
      { dx: 2, dy: 2 });

    const leftRacket = new Racket('leftRacket',
      { y: table.top, x: table.left + 2 },
      { width: 2, height: 40 },
      10);

    const rightRacket = new Racket('rightRacket',
      { y: table.top, x: table.left + table.width - 2 },
      { width: 2, height: 40 },
      10);

    const game = new Game(table, { leftRacket, rightRacket }, ball, 0);

    return game;
  };

  const main = () => {
    const game = createGame();
    const { table, rackets: { leftRacket, rightRacket } } = game.getInfo();

    document.addEventListener('keydown', (event) => {
      controller(event.key, table, leftRacket, rightRacket);
    });

    drawView(game);

    const intervalId = setInterval(() => {
      if (game.isOver()) {
        endGame(intervalId);
      }
      game.update();
      updateView(game);
    }, 20);
  };

  window.onload = main;
})();
