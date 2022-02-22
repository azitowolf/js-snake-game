/*

FEATURES

- create the lose conditions - done
- create the snake - done
- create the fruit - done
- add fruit to snake on eat 
- create game refresh on enter

REFACTORS
- change snakeposition var name
- split out renderboard method
- optimize the actual renderboard method


*/

// Constants
const NUM_CUBES = 100;


// DOM Selectors
const $board = document.querySelector('#board');
const $dash = document.querySelector('#dash');
const $gamestatus = document.querySelector('#gamestatus');

// Properties
let snakePosition = [{x: 1, y:7},{x: 1, y:6}, {x: 1, y:5}, {x: 1, y:4},{x: 1, y:3},{x: 1, y:2}, {x: 1, y:1}];
let fruitPosition = []; //{x: 1, y:7}
let lastInstructionGiven = "ArrowDown";
let gamestatus = "";
let isPaused = false;

const createFruit = () => {
    const x = Math.ceil(Math.random()*10);
    const y = Math.ceil(Math.random()*10);
    fruitPosition = [{x,y}];
}

const lose = () => {
    console.log("LOSE");
    $board.innerHTML = '';
    gamestatus = "GAME OVER";
    clearInterval(renderCycle);
    return true;
}

const togglePause = () => {
    if(isPaused) {
        isPaused = false;
        gamestatus = 'resumed';
        renderCycle = setInterval(renderBoard, 500, $board, snakePosition);
    } else {
        isPaused = true;
        gamestatus = 'paused';
        renderBoard($board, snakePosition);
        clearInterval(renderCycle);
    }    
}

const checkForLose = (snakePosition, nextSnakeHead) => {
    // check if off board
    if(nextSnakeHead.x > 10 || nextSnakeHead.y > 10) return lose();
    if(nextSnakeHead.x < 1 || nextSnakeHead.y < 1) return lose();

    // check if touching self
    let touchingSelf = snakePosition.some((position) => {
        return nextSnakeHead.x === position.x && nextSnakeHead.y === position.y; 
    })

    if(touchingSelf) return lose();
    return false;
}

const checkForEatFruit = () => {
    let res = false;
    if(snakePosition[0].x === fruitPosition[0].x && snakePosition[0].y === fruitPosition[0].y) res = true;
    return res;
}

const moveSnake = (direction) => {

    let nextSnakeHead = snakePosition[0];
    if(direction === "ArrowRight") {
        nextSnakeHead = {...snakePosition[0], x:snakePosition[0].x + 1};
        if(checkForLose(snakePosition, nextSnakeHead)) return;
        snakePosition.unshift(nextSnakeHead);
        if(!checkForEatFruit()) {
            snakePosition.pop();
        } else {
            createFruit();
        }
    }
    if(direction === "ArrowLeft") {
        nextSnakeHead = {...snakePosition[0], x:snakePosition[0].x - 1};
        if(checkForLose(snakePosition, nextSnakeHead)) return;
        snakePosition.unshift(nextSnakeHead);
                if(!checkForEatFruit()) {
            snakePosition.pop();
        } else {
            createFruit();
        }
    }
    if(direction === "ArrowUp") {
        nextSnakeHead = {...snakePosition[0], y: snakePosition[0].y - 1};
        if(checkForLose(snakePosition, nextSnakeHead)) return;
        snakePosition.unshift(nextSnakeHead);
                if(!checkForEatFruit()) {
            snakePosition.pop();
        } else {
            createFruit();
        }
    }
    if(direction === "ArrowDown") {
        nextSnakeHead = {...snakePosition[0], y: snakePosition[0].y + 1};
        if(checkForLose(snakePosition, nextSnakeHead)) return;
        snakePosition.unshift(nextSnakeHead);
                if(!checkForEatFruit()) {
            snakePosition.pop();
        } else {
            createFruit();
        }
    }

    return true;
}

const renderBoard = (rootEl, snakePosition) => {

    console.log('RENDER BOARD');
    console.log(snakePosition);
    $board.innerHTML = '';

    moveSnake(lastInstructionGiven);

    $dash.textContent = "Score: " + snakePosition.length;
    $gamestatus.textContent = gamestatus;

    for(let i=1; i <= NUM_CUBES; i++){

        let cube = document.createElement('div');
        cube.classList.add('cube');

        // define coordinates
        var xcoord = null;
        if(i > 10) {
            if (i %10 === 0 ) {
                xcoord = 10;
            }
            else {
                xcoord = i % 10
            }
         } else { 
             xcoord = i
        }

        var ycoord = i > 10 ? Math.floor((i + 9) / 10) : 1;
        cube.dataset['xcoord'] = (xcoord);
        cube.dataset['ycoord'] = (ycoord);

        snakePosition.forEach((position) => {
            if(position.x === xcoord && position.y === ycoord) {
                cube.classList.add('selected');
            }
        })

        fruitPosition.forEach((position) => {
            if(position.x === xcoord && position.y === ycoord) {
                cube.classList.add('fruit');
            }
        })

        rootEl.appendChild(cube);
    }


}

document.addEventListener('keyup', (e) => {
    // controls
    if(e.key === "ArrowRight") {
        // do not allow direct reverse command 
        if(lastInstructionGiven === "ArrowLeft") return;
        lastInstructionGiven = e.key;
    }
    if(e.key === "ArrowLeft") {
        if(lastInstructionGiven === "ArrowRight") return;
        lastInstructionGiven = e.key;
    }
    if(e.key === "ArrowUp") {
        if(lastInstructionGiven === "ArrowDown") return;
        lastInstructionGiven = e.key;
    }
    if(e.key === "ArrowDown") {
        if(lastInstructionGiven === "ArrowUp") return;
        lastInstructionGiven = e.key;
    }
    // special commands
    if(e.code === "Space") {
        togglePause();
    }
    if(e.key === "Enter") {
        window.location.reload();
    }
})

createFruit();
let renderCycle = setInterval(renderBoard, 200, $board, snakePosition);
