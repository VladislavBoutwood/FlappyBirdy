//board variables, used for drawaing on canvas
let board; //accesses canvas tag
let boardWidth = 360;
let boardHieght = 640; //px
let context;



//making bird
let birdWidth = 34; //width/height ratio = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHieght/2;
let birdImg;


let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//variables for pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//game phyiscs

let velocityX = -1; //pipes left speed
let velocityY = 0; //bird jump speed
let gravity = 0.06;

let gameOver = false;
let score = 0;

window.onload = function () {       //event handler property when entire page has fully loaded
    board = document.getElementById("board");
    board.height = boardHieght;
    board.width = boardWidth;
    context = board.getContext("2d"); //method on html canvas elements to render context draw functions for canvas, an object provides interface for drawing on canvas.

    //drawing bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x,bird.y,bird.width, bird.height);
    birdImg = new Image(); //new image object
    birdImg.src = "flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //load pipes
    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";


    requestAnimationFrame(update); //tells browser you wish to perfom an Animation, requests a callback function to match display refresh rate

    setInterval(placePipes, 1500); //function = placePipes, every 1500ms

    document.addEventListener("keydown", moveBird);
}

//update function = used to update frames on the cavas - making game loop

function update() {
    requestAnimationFrame(update); //updates frame
    if (gameOver) {
        return;
    }

    context.clearRect(0,0,board.width, board.height); //clears previous frame otherwise frames stack upon each other
    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    //draw bird for each frame
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1/2;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes offscreen
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }


    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 160 ,80);

    if (gameOver) {
        context.fillText("GAME OVER!", 40 ,180);
        context.fillText("HIT SPACE", 60 ,262);
        context.fillText("TO RESTART", 40 ,310);
    }

}

function placePipes() {
    if (gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4- Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;


    let topPipe = { //creating object
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checks to see if bird has passed this pipe yet
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
  
}

function moveBird(e) { //e = key event
    if (e.code == "Space" || e.code == "ArrowUp") {
        velocityY = -3;

        if(gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b) { //a (bird) and b (pipe) are 2 rectangles comparing positions
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}