const PI = 3.14159265;
const COMPLEXITY_DEFAULT = 5;
const COMPLEXITY_MIN = 3;
const COMPLEXITY_MAX = 60;
const MAX_ITERATIONS = 500;
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 900;
const SVG_RADIUS = 500;
const SVG_CIRC = 2 * PI * SVG_RADIUS;
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
let exitPoint = {x: 0, y: 0};

let wallColor = null;
let spaceColor = null;

let filename = FILENAME_DEFAULT;
let namespace = "http://www.w3.org/2000/svg";

let player = null
let playerColor = null;

let radial = false;


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
    document.getElementById("button_convert").addEventListener("click", convert);
    // document.getElementById("button_save").addEventListener("click", save);

}

function convert()
{
    if (!radial)
    {
        radial = true;
        document.getElementById("mazeSVG").setAttribute("style", "display: none;");
        document.getElementById("radMazeSVG").setAttribute("style", "display: block;");
    }

    else
    {
        radial = false;
        document.getElementById("mazeSVG").setAttribute("style", "display: block;");
        document.getElementById("radMazeSVG").setAttribute("style", "display: none;");
    }

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

function drawArc(theta, phi, length, thickness, color)
{
    let sx = SVG_RADIUS - phi * Math.cos(theta);
    let sy = SVG_RADIUS - phi * Math.sin(theta);

    let dTheta = theta - (length / columns) * 2 * PI;
    if (length > columns / 2)
        dTheta = theta + (length / columns) * 2 * PI;

    let dx = SVG_RADIUS - phi * Math.cos(dTheta);
    let dy = SVG_RADIUS - phi * Math.sin(dTheta);

    let el = document.createElementNS(namespace, "path");
    let svg = document.getElementById("radMazeSVG");
    let pathStr = "M " + sx + " " + sy;
    pathStr += " A " + phi + " " + phi;
    
    if (length > columns / 2) pathStr += " 0 1 1 ";
    else pathStr += " 0 0 1 ";

    pathStr += dx + " " + dy;

    el.setAttribute("d", pathStr);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", color.getCode());
    el.setAttribute("stroke-width", thickness);

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

    if (checkX == exitPoint.x && checkY == exitPoint.y)
    {
        console.log("Maze solved!");
        window.removeEventListener("keydown", keyDown, true);
        return;
    }

    switch (event.keyCode)
    {
        case 37:
        {
            player.direction = 3;
            --checkX;
            // console.log("Movement left!");
        } break;

        case 38:
        {
            player.direction = 1;
            --checkY;
            // console.log("Movement up!");
        } break;

        case 39:
        {
            player.direction = 4;
            ++checkX;
            // console.log("Movement right!");
        } break;

        case 40:
        {
            player.direction = 2;
            ++checkY;
            // console.log("Movement down!");
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
    let el = document.createElementNS(namespace, "polyline");
    let el_tip1 = document.createElementNS(namespace, "circle");
    let el_tip2 = document.createElementNS(namespace, "circle");
    let svg = document.getElementById("mazeSVG");
    
    let elPrevious = document.getElementById("playerPL");
    let elPrevious_t1 = document.getElementById("player_t1");
    let elPrevious_t2 = document.getElementById("player_t2");

    if (elPrevious != null) svg.removeChild(elPrevious);
    if (elPrevious_t1 != null) svg.removeChild(elPrevious_t1);
    if (elPrevious_t2 != null) svg.removeChild(elPrevious_t2);


    let pointsStr = "";

    for (let pt of player.points)
    {
        let px = columnPixels * (pt.x + 1 / 2);
        let py = rowPixels * (pt.y + 1 / 2);
        pointsStr += (px + "," + py + " ");
    }

    el.setAttribute("points", pointsStr);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", playerColor.getCode());
    el.setAttribute("stroke-width", columnPixels);
    el.setAttribute("id", "playerPL");
    svg.appendChild(el);

    let t1_x = columnPixels * (player.points[0].x + 1 / 2);
    let t1_y = rowPixels * (player.points[0].y + 1 / 2);
    el_tip1.setAttribute("cx", t1_x);
    el_tip1.setAttribute("cy", t1_y);
    el_tip1.setAttribute("r", columnPixels / 2);
    el_tip1.setAttribute("fill", playerColor.getCode());
    el_tip1.setAttribute("id", "player_t1");
    svg.appendChild(el_tip1);


    let t2_x = columnPixels * (player.points[player.points.length - 1].x + 1 / 2);
    let t2_y = rowPixels * (player.points[player.points.length - 1].y + 1 / 2);
    el_tip2.setAttribute("cx", t2_x);
    el_tip2.setAttribute("cy", t2_y);
    el_tip2.setAttribute("r", columnPixels / 2);
    el_tip2.setAttribute("fill", playerTipColor.getCode());
    el_tip2.setAttribute("id", "player_t2");
    svg.appendChild(el_tip2);

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