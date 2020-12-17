const COMPLEXITY_DEFAULT = 5;
const COMPLEXITY_MIN = 3;
const COMPLEXITY_MAX = 60;
const MAX_ITERATIONS = 500;
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 900;
const BRANCH_PERCENT = 10;
const CH_WALL = 'X';
const CH_SPACE = '-';
const FILENAME_DEFAULT = "maze_default";

let complexity = 20;
let mazeGrid = [];
let paths = [];
let branches = [];
let rows = complexity * 3;
let columns = complexity * 4;
let columnPixels = SVG_WIDTH / columns;
let rowPixels = SVG_HEIGHT / rows;
let wall_left = 0;
let wall_top = 0;
let wall_right = columns - 1;
let wall_bottom = rows - 1;
let while_control = 0;

let startPoint = {x: 0, y: 0};
let endPoint = {x: 0, y: 0};

let wallColor = null;
let spaceColor = null;

let filename = FILENAME_DEFAULT;
let namespace = "http://www.w3.org/2000/svg";

let player = null
let playerColor = null;


function generate()
{
    console.log("Generate function!");

    rows = complexity * 3;
    columns = complexity * 4;

    initMaze();

    // Create the seed WallPaths... Around the entrance and exit
    addPath(startPoint.x - 1, startPoint.y + 1, 2);
    addPath(startPoint.x + 1, startPoint.y + 1, 2);
    addPath(exitPoint.x - 1, exitPoint.y - 1, 1);
    addPath(exitPoint.x + 1, exitPoint.y - 1, 1);
    addTopWallPaths();
    addBottomWallPaths();
    addLeftWallPaths();
    addRightWallPaths();
    addRandomInteriorPaths(complexity);

    // Grow main paths
    for (let i = 0; i < MAX_ITERATIONS; ++i)
    {
        growPaths();
    }

    // Fill in little gaps
    while_control = 0;
    while (!isComplete())
    {
        growPaths();
        ++while_control;
        if (while_control > 1000)
            break;
    }

    randomizeColors();
    paintMaze();

    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    document.getElementById("button_convert").removeAttribute("disabled");
    document.getElementById("button_save").removeAttribute("disabled");

    document.getElementById("button_solve").addEventListener("click", playerSolve);
    // document.getElementById("button_solution").addEventListener("click", computerSolve);
    // document.getElementById("button_race").addEventListener("click", race);
    // document.getElementById("button_convert").addEventListener("click", convert);
    // document.getElementById("button_save").addEventListener("click", save);

}



function drawHorizontal(x, y, length, thickness, color)
{
    let el = document.createElementNS(namespace, "rect");
    let svg = document.getElementById("mazeSVG");

    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", length);
    el.setAttribute("height", thickness);
    el.setAttribute("fill", color.getCode());
    el.setAttribute("rx", 10);

    svg.appendChild(el);

}

function drawVertical(x, y, length, thickness, color)
{
    let el = document.createElementNS(namespace, "rect");
    let svg = document.getElementById("mazeSVG");

    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", thickness);
    el.setAttribute("height", length);
    el.setAttribute("fill", color.getCode());
    el.setAttribute("rx", 10);

    svg.appendChild(el);

}

function getRandom(int)
{
    return Math.floor(Math.random() * int);
}

function playerSolve()
{
    player = new WallPath(startPoint.x, startPoint.y, 2);
    playerColor = new ColorRGB(255, 20, 147);
    playerTipColor = new ColorRGB(0, 255, 255);
    player.grow();

    // window.addEventListener("mousemove", mouse, true);
    window.addEventListener("keydown", keyDown, true);

    drawPlayer();
}

function keyDown(event)
{
    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    switch (event.keyCode)
    {
        case 37:
        {
            player.direction = 3;
            --checkX;
            console.log("Movement left!");
        } break;

        case 38:
        {
            player.direction = 1;
            --checkY;
            console.log("Movement up!");
        } break;

        case 39:
        {
            player.direction = 4;
            ++checkX;
            console.log("Movement right!");
        } break;

        case 40:
        {
            player.direction = 2;
            ++checkY;
            console.log("Movement down!");
        } break;

        default: {} break;
    }

    if (player.points.length > 2 &&
        (checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y) )
    {
        player.points.pop();
    }

    else if (player.direction > 0 && mazeGrid[checkY][checkX] !== CH_WALL)
        player.grow();

    // paintMaze();
    drawPlayer();
}

function keyUp(event)
{
    player.direction = 0;
}

function mouse(event)
{
    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    if (event.movementX > 1)
    {
        player.direction = 4;
        ++checkX;
        console.log("Movement right!");
    }

    if (event.movementX < -1)
    {
        player.direction = 3;
        --checkX;
        console.log("Movement left!");
    }

    if (event.movementY > 1)
    {
        player.direction = 2;
        ++checkY;
        console.log("Movement down!");
    }

    if (event.movementY < -1)
    {
        player.direction = 1;
        --checkY;
        console.log("Movement up!");
    }

    if (player.points.length > 2 &&
        checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y)
    {
        player.points.pop();
    }

    else if (player.direction > 0 && mazeGrid[checkY][checkX] !== CH_WALL)
        player.grow();

    drawPlayer();

}

function drawPlayer()
{
    for (let point of player.points)
    {
        drawHorizontal(point.x * columnPixels, point.y * rowPixels, columnPixels, columnPixels, playerColor);
    }

    let lastPoint = player.points[player.points.length - 1];

    drawHorizontal(lastPoint.x * columnPixels, lastPoint.y * rowPixels, columnPixels, columnPixels, playerTipColor);    
}

function pointEquals(p1, p2)
{
    return (p1.x == p2.x && p1.y == p2.y);
}



window.onload = function()
{
    console.log("Maze window loaded!");
    document.getElementById("button_generate").addEventListener("click", generate);
}