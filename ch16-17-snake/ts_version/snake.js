console.log('Snake Game Start!');
var canvas = document.getElementById("canvas");
if (!canvas) {
    throw new Error('Can not find any canvas!');
}
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
var score = 0;
var drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};
var drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};
var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
};
var Block = /** @class */ (function () {
    function Block(col, row) {
        this.col = col;
        this.row = row;
    }
    Block.prototype.drawSquare = function (color) {
        var x = this.col * blockSize;
        var y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    };
    Block.prototype.drawCircle = function (color) {
        var centerX = this.col * blockSize + blockSize / 2;
        var centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        this._circle(centerX, centerY, blockSize / 2, true);
    };
    Block.prototype.equal = function (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };
    Block.prototype._circle = function (x, y, r, fill) {
        if (fill === void 0) { fill = false; }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        if (fill) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    };
    return Block;
}());
var Snake = /** @class */ (function () {
    function Snake() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];
        this.direction = "right";
        this.nextDirection = "right";
    }
    Snake.prototype.draw = function () {
        this.segments.forEach(function (block) {
            block.drawSquare("Blue");
        });
    };
    Snake.prototype.move = function () {
        var head = this.segments[0];
        var newHead;
        this.direction = this.nextDirection;
        if (this.direction === "right") {
            newHead = new Block(head.col + 1, head.row);
        }
        else if (this.direction === "down") {
            newHead = new Block(head.col, head.row + 1);
        }
        else if (this.direction === "left") {
            newHead = new Block(head.col - 1, head.row);
        }
        else if (this.direction === "up") {
            newHead = new Block(head.col, head.row - 1);
        }
        if (this.checkCollision(newHead)) {
            gameOver();
            return;
        }
        this.segments.unshift(newHead); // add newHead as the first element
        if (newHead.equal(apple.position)) {
            score++;
            apple.move(this);
        }
        else {
            this.segments.pop();
        }
    };
    Snake.prototype.checkCollision = function (newHead) {
        var leftCollision = (newHead.col === 0);
        var rightCollision = (newHead.col === widthInBlocks - 1);
        var topCollision = (newHead.row === 0);
        var bottomCollision = (newHead.row === heightInBlocks - 1);
        var wallCollision = leftCollision || rightCollision || topCollision || bottomCollision;
        var selfCollision = this.checkCollisionAtGivenBlock(newHead);
        return wallCollision || selfCollision;
    };
    Snake.prototype.checkCollisionAtGivenBlock = function (block) {
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            if (block.equal(segment)) {
                return true;
            }
        }
    };
    Snake.prototype.setDirection = function (newDirection) {
        if (this.direction === "up" && newDirection === "down"
            || this.direction === "down" && newDirection === "up"
            || this.direction === "left" && newDirection === "right"
            || this.direction === "right" && newDirection === "left") {
            return;
        }
        this.nextDirection = newDirection;
    };
    return Snake;
}());
var Apple = /** @class */ (function () {
    function Apple() {
        this.position = new Block(10, 10);
    }
    Apple.prototype.draw = function () {
        this.position.drawCircle("LimeGreen");
    };
    Apple.prototype.move = function (snake) {
        // move apple to new position, also avoid collision with the snake
        var newPosition;
        do {
            newPosition = this._getNewPosition();
        } while (snake.checkCollisionAtGivenBlock(newPosition));
        this.position = newPosition;
    };
    Apple.prototype._getNewPosition = function () {
        var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        return new Block(randomCol, randomRow);
    };
    return Apple;
}());
var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
// document.querySelector('body').onkeydown(function (event) {
//     let newDirection = directions[event.keyCode];
//     if (newDirection) {
//         snake.setDirection(newDirection);
//     }
// });
document.querySelector('body').addEventListener('keydown', function (event) {
    var newDirection = directions[event.keyCode];
    if (newDirection) {
        snake.setDirection(newDirection);
    }
});
var snake = new Snake();
var apple = new Apple();
var intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);
