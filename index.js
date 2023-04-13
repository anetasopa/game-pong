function loaded() {
  var canvas = document.getElementById("canvas");
  var button = document.querySelector("button");
  var ctx = canvas.getContext("2d");

  const MAX_POINTS = 5;
  const BALL_SPEED = 2;
  const BALL_START_X = 200;
  const BALL_START_Y = 90;
  const PLAYER_VELOCITY = 25;

  class Game {
    constructor(ballNew, playerLeft, playerRight) {
      this.ballNew = ballNew;
      this.playerLeft = playerLeft;
      this.playerRight = playerRight;
    }

    logic() {
      this.ballNew.speedBall();

      if (this.hasBallHitPlayerOne()) {
        this.ballNew.invertVx();
      }

      if (this.hasBallHitPlayerTwo()) {
        this.ballNew.invertVx();
      }

      if (this.ballNew.bounceOfTop()) {
        this.ballNew.invertVy();
      }

      if (this.ballNew.bounceOfButton()) {
        this.ballNew.invertVy();
      }

      if (this.ballNew.bounceOfRight()) {
        this.addPointPlayerOne();
        this.ballNew.resetPosition();
      }

      if (this.ballNew.bounceOfLeft()) {
        this.addPointPlayerTwo();
        this.ballNew.resetPosition();
      }

      if (this.didSomeoneWin()) {
        this.drawWhoWon();
        this.ballNew.stopBall();
      }
    }

    hasBallHitPlayerOne() {
      return (
        this.ballNew.x < 20 &&
        this.ballNew.y > this.playerLeft.y &&
        this.ballNew.y < this.playerLeft.y + 80
      );
    }

    hasBallHitPlayerTwo() {
      return (
        this.ballNew.x > canvas.width - 20 &&
        this.ballNew.y > this.playerRight.y &&
        this.ballNew.y < this.playerRight.y + 80
      );
    }

    addPointPlayerOne() {
      this.playerLeft.addOnePoint();
      document.querySelector(
        "h1"
      ).innerHTML = `${this.playerLeft.points} : ${this.playerRight.points}`;
    }

    addPointPlayerTwo() {
      this.playerLeft.addOnePoint();
      document.querySelector(
        "h1"
      ).innerHTML = `${this.playerLeft.points} : ${this.playerRight.points}`;
    }

    didSomeoneWin() {
      return (
        this.playerLeft.points >= MAX_POINTS ||
        this.playerRight.points >= MAX_POINTS
      );
    }

    drawWhoWon() {
      if (this.didPlayerTwoWin()) {
        document.querySelector("p").innerHTML = `Player two wins`;
      }

      if (this.didPlayerOneWin()) {
        document.querySelector("p").innerHTML = `Player one wins`;
      }
    }

    didPlayerOneWin() {
      return this.playerRight.points == MAX_POINTS;
    }

    didPlayerTwoWin() {
      return this.playerLeft.points == MAX_POINTS;
    }
  }

  class Ball {
    constructor(x, y, vx, vy, r, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.r = r;
      this.color = color;
    }

    resetPosition() {
      this.x = 200;
      this.y = 125;
    }

    bounceOfLeft() {
      return this.x < 0;
    }

    bounceOfRight() {
      return this.x > canvas.width;
    }

    bounceOfTop() {
      return this.y < 0;
    }

    bounceOfButton() {
      return this.y > canvas.height;
    }

    invertVy() {
      this.vy = -this.vy;
    }

    invertVx() {
      this.vx = -this.vx;
    }

    stopBall() {
      this.vx = 0;
      this.vy = 0;
    }

    speedBall() {
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  class Player {
    constructor(x, y, points, upButton, downButton) {
      this.x = x;
      this.y = y;
      this.points = points;
      this.upButton = upButton;
      this.downButton = downButton;
    }

    shouldMoveUp(event) {
      return event.key == this.upButton && this.y > 0;
    }

    moveUp() {
      this.y -= PLAYER_VELOCITY;
    }

    moveDown() {
      this.y += PLAYER_VELOCITY;
    }

    shouldMoveDown(event) {
      return event.key == this.downButton && this.y < 170;
    }

    addOnePoint() {
      this.points++;
    }

    resetPoints() {
      this.points = 0;
    }
  }

  const ballNew = new Ball(200, 125, 1, 1, 15, "blue");
  const playerLeft = new Player(0, 80, 0, "w", "z");
  const playerRight = new Player(380, 80, 0, "u", "n");
  const newGame = new Game(ballNew, playerLeft, playerRight);

  document.addEventListener("keydown", (event) => {
    if (playerLeft.shouldMoveUp(event)) {
      playerLeft.moveUp();
    }

    if (playerLeft.shouldMoveDown(event)) {
      playerLeft.moveDown();
    }

    if (playerRight.shouldMoveUp(event)) {
      playerRight.moveUp();
    }

    if (playerRight.shouldMoveDown(event)) {
      playerRight.moveDown();
    }
  });

  button.addEventListener("click", function () {
    ballNew.vx = BALL_SPEED;
    ballNew.vy = -BALL_SPEED;
    ballNew.x = BALL_START_X;
    ballNew.y = BALL_START_Y;
    playerLeft.resetPoints();
    playerRight.resetPoints();

    document.querySelector(
      "h1"
    ).innerHTML = `${playerLeft.points} : ${playerRight.points}`;
    document.querySelector("p").innerHTML = ``;
  });

  function drawBall(ballNew) {
    ctx.beginPath();
    ctx.arc(ballNew.x, ballNew.y, ballNew.r, 0, Math.PI * 2);
    ctx.fillStyle = ballNew.color;
    ctx.fill();
    ctx.closePath();
  }

  function drawPlayer(player) {
    ctx.beginPath();
    ctx.rect(player.x, player.y, 20, 80);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  function drawAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newGame.logic();
    drawBall(ballNew);
    drawPlayer(playerLeft);
    drawPlayer(playerRight);
  }

  function loop() {
    window.requestAnimationFrame(loop);

    drawAnimation();
  }

  loop();

}
