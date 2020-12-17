function addPath(x, y, d)
{
    if (mazeGrid[y][x] == CH_SPACE)
    {
        paths.push(new WallPath(x, y, d));
        mazeGrid[y][x] = CH_WALL;
    }

}

function addTopWallPaths()
{
    let pathY = wall_top + 1;
    let xCoords = [];

    if (startPoint.x >= columns / 2)
        xCoords.push(getRandom(startPoint.x - 4) + 2);
    else
        xCoords.push(getRandom(columns - startPoint.x - 2) + startPoint.x + 1);

    addPath(xCoords[0], pathY, 2);

    for (let i = 1; i < complexity / 2; ++i)
    {
        let nextX = xCoords[0];
        let condition = true;

        // This is to make sure the next path is at least 2 grid units away from
        // any other path and 3 units away from the maze entrance.
        while (condition)
        {
            nextX = getRandom(columns - 4) + 2;
            condition = false;

            for (let j = 0; j < i; ++j)
            {
                if (Math.abs(nextX - xCoords[j]) < 2)
                    condition = true;
            }

            if (Math.abs(nextX - startPoint.x) < 3)
                condition = true;
        }

        xCoords.push(nextX);
        addPath(nextX, pathY, 2);
    }

}

function addBottomWallPaths()
{

    let pathY = wall_bottom - 1;
    let xCoords = [];

    if (exitPoint.x >= columns / 2)
        xCoords.push(getRandom(exitPoint.x - 4) + 2);
    else
        xCoords.push(getRandom(columns - exitPoint.x - 2) + exitPoint.x + 1);

    addPath(xCoords[0], pathY, 1);

    for (let i = 1; i < complexity / 2; ++i)
    {
        let nextX = xCoords[0];
        let condition = true;

        // This is to make sure the next path is at least 2 grid units away from
        // any other path and 3 units away from the maze exit.
        while (condition)
        {
            nextX = getRandom(columns - 4) + 2;
            condition = false;

            for (let j = 0; j < i; ++j)
            {
                if (Math.abs(nextX - xCoords[j]) < 2)
                    condition = true;
            }

            if (Math.abs(nextX - exitPoint.x) < 3)
                condition = true;
        }

        xCoords.push(nextX);
        addPath(nextX, pathY, 1);
    }

}

function addLeftWallPaths()
{
    let pathX = wall_left + 1;
    let yCoords = [];

    yCoords.push(getRandom(rows - 4) + 2);
    addPath(pathX, yCoords[0], 4);

    for (let i = 1; i < complexity / 2; ++i)
    {
        let nextY = yCoords[0];
        let condition = true;

        while (condition)
        {
            nextY = getRandom(rows - 4) + 2;
            condition = false;

            for (let j = 0; j < i; ++j)
            {
                if (Math.abs(nextY - yCoords[j]) < 2)
                    condition = true;
            }
        }

        yCoords.push(nextY);
        addPath(pathX, nextY, 4);
    }

}

function addRightWallPaths()
{
    let pathX = wall_right - 1;
    let yCoords = [];

    yCoords.push(getRandom(rows - 4) + 2);
    addPath(pathX, yCoords[0], 3);

    for (let i = 1; i < complexity / 2; ++i)
    {
        let nextY = yCoords[0];
        let condition = true;

        while (condition)
        {
            nextY = getRandom(rows - 4) + 2;
            condition = false;

            for (let j = 0; j < i; ++j)
            {
                if (Math.abs(nextY - yCoords[j]) < 2)
                    condition = true;
            }
        }

        yCoords.push(nextY);
        addPath(pathX, nextY, 3);
    }

}

function addRandomInteriorPaths(num)
{
    for (let i = 0; i < num; ++i)
    {
        let randX = getRandom(columns - 4) + 2;
        let randY = getRandom(rows - 4) + 2;
        let randD = getRandom(4) + 1;
        let condition = true;

        for (let j = randY - 1; j <= randY + 1; ++j)
            for (let k = randX - 1; k <= randX + 1; ++k)
                if (mazeGrid[j][k] == CH_WALL)
                    condition = false;

        if (condition)
        {
            addPath(randX, randY, randD);
            mazeGrid[randY][randX] = CH_WALL;
        }
    }

}

function growPaths()
{
    for (let path of paths)
    {
        let roll = getRandom(100) + 1;

        if (path.active && pathIsClear(path.getCheckPoint(), path.direction))
        {
            if (roll <= 70)
            {
                path.grow();
                path.checkActive();
            }

            else
                path.changeDirection();
        }

        else
        {
            path.changeDirection();
        }

        if (!path.active && roll <= BRANCH_PERCENT)
        {
            branches.push(path.branch());
        }

        // update the grid letters
        for (let pt of path.points)
        {
            mazeGrid[pt.y][pt.x] = CH_WALL;
        }
    }

    for (let branch of branches)
    {
        if (pathIsClear(branch.getBranchCheckPoint(), branch.direction))
            paths.push(branch);
    }

    branches = [];

}

function initMaze()
{
    mazeGrid = [];
    paths = [];
    branches = [];

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

function paintBackground(c)
{

    let el = document.createElementNS(namespace, "rect");
    let svg = document.getElementById("mazeSVG");
    svg.innerHTML = "";




    el.setAttribute("x", 0);
    el.setAttribute("y", 0);
    el.setAttribute("width", SVG_WIDTH);
    el.setAttribute("height", SVG_HEIGHT);
    el.setAttribute("fill", c.getCode());

    svg.appendChild(el);

}

function paintMaze()
{
    let svg = document.getElementById("mazeSVG");
    svg.innerHTML = "";
    paintBackground(spaceColor);

    // Horizontal wall sections
    for (let i = 0; i < rows; ++i)
    {
        let sectionLength = 0;
        let sectionX = 0;
        let sectionY = i * rowPixels;

        for (let j = 0; j < columns; ++j)
        {
            if (mazeGrid[i][j] == CH_WALL)
            {
                if (sectionLength == 0)
                    sectionX = j * columnPixels;

                ++sectionLength;
            }

            if (mazeGrid[i][j] != CH_WALL || j == columns - 1)
            {
                if (sectionLength > 1)
                    drawHorizontal(sectionX, sectionY, sectionLength * columnPixels, rowPixels, wallColor);

                sectionLength = 0;
            }
        }
    }

    // Vertical wall sections
    for (let i = 0; i < columns; ++i)
    {
        let sectionLength = 0;
        let sectionX = i * columnPixels;
        let sectionY = 0;

        for (let j = 0; j < rows; ++j)
        {
            if (mazeGrid[j][i] == CH_WALL)
            {
                if (sectionLength == 0)
                    sectionY = j * rowPixels;

                ++sectionLength;
            }

            if (mazeGrid[j][i] != CH_WALL || j == rows - 1)
            {
                if (sectionLength > 1)
                    drawVertical(sectionX, sectionY, sectionLength * rowPixels, columnPixels, wallColor);

                sectionLength = 0;
            }
        }
    }
    
}

function pathIsClear(pt, dir)
{
    let checkX = Math.max(wall_left, pt.x);
    let checkY = Math.max(wall_top, pt.y);

    checkX = Math.min(wall_right, checkX);
    checkY = Math.min(wall_bottom, checkY);

    // console.log("checkY = " + checkY);
    // console.log("checkX = " + checkX);
    // console.log("mazeGrid[checkY][checkX] = " + mazeGrid[checkY][checkX]);
    if (mazeGrid[checkY][checkX] == CH_WALL)
        return false;

    switch (dir)
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