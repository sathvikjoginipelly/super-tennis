var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 3;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 1;
var showWinScreen = false;

getMousePosition = (event) => {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

//This function is executed when window loads
window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    var framesPerSecond = 90;
    setInterval(() => {
        drawAll();
        moveAll();
    }, 1000/framesPerSecond);
    canvas.addEventListener("mousemove", (event) => {
        var mousePosition = getMousePosition(event);
        paddle1Y = mousePosition.y - PADDLE_HEIGHT / 2;
    });
    canvas.addEventListener('mousedown', () => {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    });
}

rightPaddleAutoMovement = () => {
    if(ballY + 35 < paddle2Y + PADDLE_HEIGHT / 2) {
        paddle2Y -= 5;
    } else if(ballY - 35 > paddle2Y + PADDLE_HEIGHT / 2) {
        paddle2Y += 5;
    }
}

ballReset = () => {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

//This function bouces the ball back and forth
moveAll = () => {
    if(showWinScreen) {
        return;
    }

    rightPaddleAutoMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX > canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
    if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.2;
        } else {
            player2Score++;
            ballReset();
        }
    }
    if(ballX > canvas.width - 10) {
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.2;
        } else {
            player1Score++;
            ballReset();
        }
    }
    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

drawNet = () => {
    for (var i = 0; i < canvas.height; i += 20) {
        fillColor(canvas.width / 2, i, 2, 10, 'white');
    }
}

//This function draws the objects inside the canvas i.e., two paddles, one ball and canvas itself
drawAll = () => {
    fillColor(0, 0, 2000, 2000, "black");
    if(!showWinScreen) {
        drawNet();
        fillColor(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
        fillColor(canvas.width - PADDLE_THICKNESS * 2, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
        drawCircle("white", ballX, ballY, 12);

        canvasContext.fillText("Player 1: " + player1Score, 100, 100);
        canvasContext.fillText("Player 2: " + player2Score, canvas.width - 150, 100);
    } else {
        canvasContext.fillStyle = 'white';
        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Player 1 wins!", 350, 200);
        } else {
            canvasContext.fillText("Player 2 wins!", 350, 200);
        }
        canvasContext.fillText("Click to continue", 350, 350);
    }
}

//To be used in drawing objects
fillColor = (leftX, topY, width, height, fillColor) => {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

//Function to create circles
drawCircle = (circleColor, leftX, topY, circleRadius) => {
    canvasContext.fillStyle = circleColor;
    canvasContext.beginPath();
    canvasContext.arc(leftX, topY, circleRadius, 0, Math.PI * 2, true);
    canvasContext.fill();
}