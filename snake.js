
let canvas = document.getElementById('canvas_id');
canvas.width = '1200';
canvas.height = '1200';

let gameInterval;
const BLOCK_SIZE = 20;      // 每一格20px
const BLOCK_COUNT = 60;     // 20个格子
let snake;
let apple;
let score;
let level;

function gameStart() {
    snake = {
        body: [
            {x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2}
        ],
        size: 5,
        direction: {x: 0, y: -1}

    };
    putApple();                                               // 放轩一个苹果
    updateScore(0);                                           // 分数控制器, 默认为0
    updateGameLevel(1);

}

function gameRouting() {
    movSnake(snakeIsDead());                                   // 每次刷新 就移动一步蛇

    if (snakeIsDead()) {                                       // 判断蛇是否死了
        gameOver();
        return
    }

    if (snake.body[0].x === apple.x &&                          // 如果蛇头碰到苹果, 就吃掉
        snake.body[0].y === apple.y) {
        eatApple();
    }

    updateCanvas();                                             //  刷新画布
}

function updateCanvas() {
    let canvas = document.getElementById('canvas_id');
    let context = canvas.getContext('2d');              // 取出一块画布

    context.fillStyle = 'black';                                 // 填充黑色
    context.fillRect(0, 0, canvas.width, canvas.height);         // 填充的范围

    context.fillStyle = 'green';                                // 填充蛇身体的颜色
    for (let i=0; i < snake.body.length; i++) {
        context.fillRect(
            snake.body[i].x * BLOCK_SIZE + 5,                       // x 点 +5 相当于每个块缩小了5个px
            snake.body[i].y * BLOCK_SIZE + 5,                       // Y点 +5  容易分辨有几个块
            BLOCK_SIZE - 5,                                         // 范围 -5
            BLOCK_SIZE - 5
        );
    }

    context.fillStyle = 'red';                                      // 渲染出一个苹果, 矩形两个角坐标
    context.fillRect(
        apple.x * BLOCK_SIZE + 5,
        apple.y * BLOCK_SIZE + 5,
        BLOCK_SIZE - 5,
        BLOCK_SIZE - 5
        );
}

function movSnake() {
    let newBlock = {
        x: snake.body[0].x + snake.direction.x,                 // 蛇头位置 + 方向 = 蛇移动后的位置
        y: snake.body[0].y + snake.direction.y
    };

    snake.body.unshift(newBlock);                               // unshift(蛇头) 将蛇头加到列表的位置0, 也就是加到列表最前面

    while (snake.body.length > snake.size) {                    // 蛇走一步后蛇身会变长 > 设置的蛇身size长度, 就pop掉最后一位
        snake.body.pop();
    }
}

window.onload = onPageLoaded;                                   // 系统加载时, 自动执行onPageLoaded

function onPageLoaded() {
    document.addEventListener('keydown', handleKeyDown);    // 监听到有按下某键, 就执行某个函数
}

function handleKeyDown(event) {
    let originX = snake.direction.x;                             // 先拿到蛇最初的方向x y 值
    let originY = snake.direction.y;

    if (event.keyCode === 37) {                                   // 37为方向左键, 如果捕捉到是左键
        snake.direction.x = originY;
        snake.direction.y = -originX;
    } else if (event.keyCode === 39) {                            // 39为方向左键, 如果捕捉到是左键
        snake.direction.x = -originY;
        snake.direction.y = originX;
    }
}
// 默认snake.direction.x  snake.direction.y 向右韩遂{x: 1, y: 0}
//按左键 变向上前进{x: 0, y: -1}-- 变向左前进{x: -1, y: -0}--变向下{x: 0, y: 1}--变向右{x: 1, y: -0}

function snakeIsDead() {
    // 撞了墙 会死掉
    // 超出了x 0 , y 0, block_count, 也就是画面的范围, 就是撞墙了死掉
    if (snake.body[0].x < 0) {
        return true
    } else if (snake.body[0].x >= BLOCK_COUNT ) {
        return true
    } else if (snake.body[0].y < 0) {
        return true
    } else if (snake.body[0].y >= BLOCK_COUNT) {
        return true
    }
    // 撞了自己身体 会死掉
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
            return true;
        }
    }

    return false
}

function gameOver() {                           // 蛇死掉, 重新初始化游戏
    clearInterval(gameInterval);
}

function putApple() {
    apple = {
        x: Math.floor(Math.random() * BLOCK_COUNT),             // random取0~1 之间的浮点数
        y: Math.floor(Math.random() * BLOCK_COUNT)              //  x  和   y 的值
    };

    for (let i = 0; i < snake.body.length; i++) {                   // 判断开始游戏时苹果与蛇有重叠吗
        if (snake.body[i].x === apple.x &&
            snake.body[i].y === apple.y) {
          putApple();
          break
        }
    }
}

function eatApple() {                                                 // 吃苹果, 吃到后首先蛇长度+1, 再布置一个苹果
    snake.size += 1;
    putApple();
    updateGameLevel(level + 1);

    updateScore( score + 1);
}

function updateScore(newScore) {                                       // 默认为0分,
    score = newScore;
    document.getElementById('score_id').innerHTML = score;    // 获取前一个网页分数上的分数,填充到当前网页
}

function updateGameLevel(newLevel) {                                    // 游戏级别更新, 为了加快速度, 默认为1
    level = newLevel;

    if (gameInterval) {
        console.log('gameInterval::::', gameInterval);
        clearInterval(gameInterval);
    }
    console.log('level:::', level);
    gameInterval = setInterval(gameRouting, 1000 / (10 + level));          // 隔1秒画布刷新一次,计算状态 与 画出画面

}

document.getElementById('gameStart-btn').addEventListener('click', gameStart);






























