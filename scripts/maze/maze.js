const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const RACE_LEVEL_1_MS = 200;
const RACE_LEVEL_2_MS = 150;
const RACE_LEVEL_3_MS = 100;
const RACE_LEVEL_4_MS = 50;
const RACE_LEVEL_5_MS = 10;
const RACE_LEVEL_6_MS = 5;
let raceTimer = 0;

let newMaze = null;
let solution = null;
let sol = null;
let sol2 = null;
let solutionVisible = false;
let player = null;
let raceInProgress = false;
let raceTimeoutID = null;

function generate()
{
    // console.log("Generate function!");
    setText("Click on Generate New to create a new maze!");

    newMaze = new Maze(document.getElementById("complexity-select").value);
    sol = new Solver(newMaze, getRandom(3));
    // sol2 = new Solver(newMaze, getRandom(3));
    raceInProgress = false;
    if (raceTimeoutID) window.clearTimeout(raceTimeoutID);

    


    document.getElementById("mazeSVG").removeEventListener("click", generate);

    if (player != null)
    {
        console.log("Removing player solution");
        window.removeEventListener("keydown", keyDown, true);
        player = null;
        drawPlayer();

    }

    if (solutionVisible)
        computerSolve();

    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    // document.getElementById("button_save").removeAttribute("disabled");
    // document.getElementById("button_grid").removeAttribute("disabled");

    document.getElementById("button_solve").addEventListener("click", playerSolve);
    document.getElementById("button_solution").addEventListener("click", computerSolve);
    document.getElementById("button_race").addEventListener("click", beginRace);
    // document.getElementById("button_save").addEventListener("click", save);
    // document.getElementById("button_grid").addEventListener("click", showGrid);
    // document.getElementById("button_grid").innerHTML = "Show Grid";

}

function countToTen(n)
{
    console.log(n + " mississippi");

    if (n < 10)
    {
        window.setTimeout(countToTen, 1000, (n + 1));
    }
}

function beginRace()
{

    if (!raceInProgress)
    {
        let roll = getRandom(3);
        sol = new Solver(newMaze, (roll + 1) % 3);
        // sol2 = new Solver(newMaze, (roll + 2) % 3);

        race();
    }

    else
    {
        console.log("Race currently in progress");
    }
}

function race()
{
    sol.draw();
    sol.iterate();

    // sol2.draw();
    // sol2.iterate();

    // if (!sol.isSolved() || !sol2.isSolved())
    if (!sol.isSolved())
    {
        raceInProgress = true;
        raceTimeoutID = window.setTimeout(race, 5);
    }

    else
    {
        raceInProgress = false;
    }

}



function getRandom(int)
{
    return Math.floor(Math.random() * int);
}

function computerSolve()
{
    console.log("Computer solution...");

    

    if (!solutionVisible)
    {
        solution = new Solver(newMaze, 1);
        solution.solveMaze();
        solution.draw();


        solutionVisible = true;
        document.getElementById("button_solution").innerHTML = "Hide Solution"; 
    }

    else
    {
        solution.hide();
        solutionVisible = false;
        document.getElementById("button_solution").innerHTML = "Show Solution"; 
    }

}

function setText(str)
{
    document.getElementById("maze-text").innerText = str;
}

function playerSolve()
{
    setText("Use arrow keys to solve the maze.");
    player = new WallPath(newMaze.startX, newMaze.startY);
    playerColor = new ColorRGB(255, 20, 147);
    playerTipColor = new ColorRGB(0, 255, 255);
    player.grow();

    // window.addEventListener("mousemove", mouse, true);
    window.addEventListener("keydown", keyDown, true);
    document.getElementById("mazeSVG").addEventListener("touchmove", touch, false);

    drawPlayer();

}

function touch(event)
{
    event.preventDefault();
}



function keyDown(event)
{
    event.preventDefault();

    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    if (checkX == newMaze.exitX && checkY == newMaze.exitY)
    {
        console.log("Maze solved!");
        setText("Great job, you solved the maze!");
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

    if (checkX < 0 || checkY < 0) return;

    if (player.points.length > 2 &&
        (checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y) )
    {
        player.points.pop();
    }

    else if (player.direction > 0 && newMaze.mazeGrid[checkY][checkX] !== CH_WALL)
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
    let el = document.createElementNS(SVG_NAMESPACE, "polyline");
    let el_tip1 = document.createElementNS(SVG_NAMESPACE, "circle");
    let el_tip2 = document.createElementNS(SVG_NAMESPACE, "circle");
    let svg = document.getElementById("mazeSVG");
    
    let elPrevious = document.getElementById("playerPL");
    let elPrevious_t1 = document.getElementById("player_t1");
    let elPrevious_t2 = document.getElementById("player_t2");

    if (elPrevious != null) svg.removeChild(elPrevious);
    if (elPrevious_t1 != null) svg.removeChild(elPrevious_t1);
    if (elPrevious_t2 != null) svg.removeChild(elPrevious_t2);

    if (player == null) return;


    let pointsStr = "";

    for (let pt of player.points)
    {
        let px = newMaze.columnPixels * (pt.x + 1 / 2);
        let py = newMaze.rowPixels * (pt.y + 1 / 2);
        pointsStr += (px + "," + py + " ");
    }

    el.setAttribute("points", pointsStr);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", playerColor.getCode());
    el.setAttribute("stroke-width", newMaze.columnPixels);
    el.setAttribute("id", "playerPL");
    svg.appendChild(el);

    let t1_x = newMaze.columnPixels * (player.points[0].x + 1 / 2);
    let t1_y = newMaze.rowPixels * (player.points[0].y + 1 / 2);
    el_tip1.setAttribute("cx", t1_x);
    el_tip1.setAttribute("cy", t1_y);
    el_tip1.setAttribute("r", newMaze.columnPixels / 2);
    el_tip1.setAttribute("fill", playerColor.getCode());
    el_tip1.setAttribute("id", "player_t1");
    svg.appendChild(el_tip1);


    let t2_x = newMaze.columnPixels * (player.points[player.points.length - 1].x + 1 / 2);
    let t2_y = newMaze.rowPixels * (player.points[player.points.length - 1].y + 1 / 2);
    el_tip2.setAttribute("cx", t2_x);
    el_tip2.setAttribute("cy", t2_y);
    el_tip2.setAttribute("r", newMaze.columnPixels / 2);
    el_tip2.setAttribute("fill", playerTipColor.getCode());
    el_tip2.setAttribute("id", "player_t2");
    svg.appendChild(el_tip2);

}

function pointEquals(p1, p2)
{
    return (p1.x == p2.x && p1.y == p2.y);
}

function showGrid()
{
    if (newMaze != null)
        newMaze.paintGrid();
}



window.onload = function()
{
    console.log("Maze window loaded!");
    document.getElementById("button_generate").addEventListener("click", generate);
    document.getElementById("mazeSVG").addEventListener("click", generate);
    
}