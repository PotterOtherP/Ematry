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

let complexity = COMPLEXITY_DEFAULT;
let mazeGrid = [];
let paths = [];
let branches = [];
let rows = complexity * 3;
let columns = complexity * 4;
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

function generate()
{
    console.log("Generate function!");

    rows = complexity * 3;
    columns = complexity * 4;

    initMaze();


    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    document.getElementById("button_convert").removeAttribute("disabled");
    document.getElementById("button_save").removeAttribute("disabled");

    // document.getElementById("button_solve").addEventListener("click", playerSolve);
    // document.getElementById("button_solution").addEventListener("click", computerSolve);
    // document.getElementById("button_race").addEventListener("click", race);
    // document.getElementById("button_convert").addEventListener("click", convert);
    // document.getElementById("button_save").addEventListener("click", save);
}

function addPath(x, y, d)
{
    if (mazeGrid[y][x] == CH_SPACE)
    {
        paths.push(new WallPath(x, y, d));
        mazeGrid[y][x] = CH_WALL;
    }
    
}

function getRandom(int)
{
    return Math.floor(Math.random() * int);
}

function initMaze()
{
    for (let i = 0; i < rows; ++i)
    {
        mazeGrid.push([]);

        for (let j = 0; j < columns; ++j)
        {
            if (i == wall_top || i == wall_bottom || j == wall_left || j == wall_right)
                mazeGrid[i].push(CH_WALL);
            else
                mazeGrid[i].push(CH_SPACE);
        }
    }

    let startX = getRandom(columns - 6) + 3;
    let exitX = getRandom(columns - 6) + 3;

    mazeGrid[wall_top][startX] = 'S';
    mazeGrid[wall_bottom][exitX] = 'E';

    startPoint = {x: startX, y: wall_top};
    exitPoint = {x: exitX, y: wall_bottom};

}

function isComplete()
{
    let result = true;

    // Horizontal set of 2 x 3 points
    for (let i = 1; i < rows - 2; ++i)
    {
        for (let j = 1; j < columns - 2; ++j)
        {
            if (mazeGrid[i][j] == CH_SPACE &&
                mazeGrid[i][j + 1] == CH_SPACE &&
                mazeGrid[i][j - 1] == CH_SPACE &&
                mazeGrid[i + 1][j] == CH_SPACE &&
                mazeGrid[i + 1][j + 1] == CH_SPACE &&
                mazeGrid[i + 1][j - 1] == CH_SPACE)
            {
                let roll = getRandom(2);

                if (roll == 0 && mazeGrid[i - 1][j] == CH_WALL)
                {
                    addPath(j, i, 2);
                }

                else if (roll == 1 && mazeGrid[i + 2][j] == CH_WALL)
                {
                    addPath(j, i + 1, 1);
                }

                result = false;
            }
        }
    }

    // Vertical set of 2 x 3 points
    for (let i = 1; i < rows - 2; ++i)
    {
        for (let j = 1; j < columns - 2; ++j)
        {
            if (mazeGrid[i][j] == CH_SPACE &&
                mazeGrid[i][j + 1] == CH_SPACE &&
                mazeGrid[i - 1][j] == CH_SPACE &&
                mazeGrid[i - 1][j + 1] == CH_SPACE &&
                mazeGrid[i + 1][j] == CH_SPACE &&
                mazeGrid[i + 1][j + 1] == CH_SPACE)
            {
                let roll = getRandom(2);

                if (roll == 0 && mazeGrid[i - 1][j] == CH_WALL)
                {
                    addPath(j, i, 3);
                }

                else if (roll == 1 && mazeGrid[i + 2][j] == CH_WALL)
                {
                    addPath(j + 1, i, 4);
                }

                result = false;
            }
        }
    }

    return result;

}

function pathIsClear(pt, dir)
{
    let checkX = Math.max(wall_left, pt.x);
    let checkY = Math.max(wall_top, pt.y);

    checkX = Math.min(wall_right, pt.x);
    checkY = Math.min(wall_bottom, pt.y);

    if (mazeGrid[checkY][checkX] == CH_WALL)
        return false;

    switch (d)
    {
        case 1:
        {
            if (mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                mazeGrid[checkY + 1][checkX + 1] == CH_WALL ||
                mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                mazeGrid[checkY + 1][checkX - 1] == CH_WALL)
            {
                return false;
            }

        } break;
        
        case 2:
        {
            if (mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX + 1] == CH_WALL ||
                mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX - 1] == CH_WALL)
            {
                return false;
            }

        } break;

        case 3:
        {
            if (mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                mazeGrid[checkY + 1][checkX + 1] == CH_WALL ||
                mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX + 1] == CH_WALL)
            {   
                return false;
            }

        } break;

        case 4:
        {
            if (mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                mazeGrid[checkY + 1][checkX - 1] == CH_WALL ||
                mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                mazeGrid[checkY - 1][checkX - 1] == CH_WALL)
            {   
                return false;
            }

        } break;

        default: {} break;
    }
        
    return true;

}

function pointEquals(p1, p2)
{
    return (p1.x == p2.x && p1.y == p2.y);
}

function randomizeColors()
{
    let spaceRed = getRandom(40) + 190;
    let spaceGreen = getRandom(40) + 190;
    let spaceBlue = getRandom(40) + 190;

    let wallRed = 255 - spaceRed;
    let wallGreen = 255 - spaceGreen;
    let wallBlue = 255 - spaceBlue;

    wallColor = new ColorRGB(wallRed, wallGreen, wallBlue);
    spaceColor = new ColorRGB(spaceRed, spaceGreen, spaceBlue);

}

window.onload = function()
{
    console.log("Maze window loaded!");
    document.getElementById("button_generate").addEventListener("click", generate);
}