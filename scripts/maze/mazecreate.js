const COMPLEXITY_DEFAULT = 5;
const COMPLEXITY_MIN = 3;
const COMPLEXITY_MAX = 61;
const MAX_ITERATIONS = 50000;
const SVG_WIDTH = 1204;
const SVG_HEIGHT = 900;
const BRANCH_PERCENT = 10;
const CH_WALL = 'X';
const CH_SPACE = '-';
const FILENAME_DEFAULT = "maze_default";

class Maze {

    constructor(comp)
    {
        this.complexity = (comp >= COMPLEXITY_MIN && comp <= COMPLEXITY_MAX) ? comp : COMPLEXITY_DEFAULT;
        if (this.complexity % 2 == 0) ++this.complexity;

        this.mazeGrid = [];
        this.paths = [];
        this.branches = [];
        this.rows = this.complexity * 3;
        this.columns = (this.complexity * 4) + 1;
        this.columnPixels = SVG_WIDTH / this.columns;
        this.rowPixels = SVG_HEIGHT / this.rows;
        this.wall_left = 0;
        this.wall_top = 0;
        this.wall_right = this.columns - 1;
        this.wall_bottom = this.rows - 1;
        this.while_control = 0;
        this.grid_visible = false;

        this.startPoint = {x: 0, y: 0};
        this.exitPoint = {x: 0, y: 0};
        this.startX = 0;
        this.startY = 0;
        this.exitX = 0;
        this.exitY = 0;

        this.wallColor = null;
        this.spaceColor = null;

        this.filename = FILENAME_DEFAULT;
        this.namespace = SVG_NAMESPACE;

        this.player = null;
        this.playerColor = null;

        this.initMaze();
        this.randomizeColors();

        // Create the seed WallPaths... Around the entrance and exit
        this.addPath(this.startPoint.x - 1, this.startPoint.y + 1, 2);
        this.addPath(this.startPoint.x + 1, this.startPoint.y + 1, 2);
        this.addPath(this.exitPoint.x - 1, this.exitPoint.y - 1, 1);
        this.addPath(this.exitPoint.x + 1, this.exitPoint.y - 1, 1);
        this.addTopWallPaths();
        this.addBottomWallPaths();
        this.addLeftWallPaths();
        this.addRightWallPaths();

        while (this.pathsActive())
        {
            if (this.while_control > MAX_ITERATIONS)
            {
                console.log("Max iterations reached: wall paths")
                break;
            }
            ++this.while_control;

            this.growPaths();
        }


        while (!this.isComplete())
        {
            if (this.while_control > MAX_ITERATIONS)
            {
                console.log("Max iterations reached: branches")
                break;
            }
            ++this.while_control;

            for (let path of this.paths)
            {
                if (path.points.length <= 2) continue;

                let pt = path.branch();
                if (this.pathIsClear(pt.getBranchCheckPoint(), pt.direction))
                    this.paths.push(pt);
            }

            while (this.pathsActive())
            {
                if (this.while_control > MAX_ITERATIONS)
                    break;
                ++this.while_control;

                this.growPaths();
            }
        }

        // console.log("Branch iterations to finish: " + this.while_control);

        this.paintMaze();

    }

    addPath(x, y, d)
    {
        if (this.mazeGrid[y][x] == CH_SPACE)
        {
            this.paths.push(new WallPath(x, y, d));
            this.mazeGrid[y][x] = CH_WALL;

        }

    }

    addTopWallPaths()
    {
        let pathY= this.wall_top + 1;
        let pathX = getRandom(2) * 2 + 2;

        if (Math.abs(this.startX - pathX) > 3)
            this.addPath(pathX, pathY, 2);

        for (let i = pathX; i <= this.wall_right - 2; i += 4)
        {
            let roll = getRandom(2);

            if (roll == 1 && Math.abs(this.startX - i) > 3)
                this.addPath(i, pathY, 2);
        }

    }

    addBottomWallPaths()
    {
        let pathY= this.wall_bottom - 1;
        let pathX = getRandom(2) * 2 + 2;

        if (Math.abs(this.exitX - pathX) > 3)
            this.addPath(pathX, pathY, 1);

        for (let i = pathX; i <= this.wall_right - 2; i += 4)
        {
            let roll = getRandom(2);

            if (roll == 1 && Math.abs(this.exitX - i) > 3)
                this.addPath(i, pathY, 1);
        }

    }

    addLeftWallPaths()
    {
         let pathX = this.wall_left + 1;
         let pathY = getRandom(2) * 2 + 4;

         this.addPath(pathX, pathY, 4);

         for (let i = pathY; i <= this.wall_bottom - 3; i += 4)
         {
            let roll = getRandom(2);

            if (roll == 1)
                this.addPath(pathX, i, 4);
         }

    }

    addRightWallPaths()
    {
         let pathX = this.wall_right - 1;
         let pathY = getRandom(2) * 2 + 4;

         this.addPath(pathX, pathY, 3);

         for (let i = pathY; i <= this.wall_bottom - 3; i += 4)
         {
            let roll = getRandom(2);

            if (roll == 1)
                this.addPath(pathX, i, 3);
         }

    }

    addRandomInteriorPaths(num)
    {
        for (let i = 0; i < num; ++i)
        {
            let randX = getRandom(this.columns - 4) + 2;
            let randY = getRandom(this.rows - 4) + 2;
            let randD = getRandom(4) + 1;
            let condition = true;

            for (let j = randY - 1; j <= randY + 1; ++j)
                for (let k = randX - 1; k <= randX + 1; ++k)
                    if (this.mazeGrid[j][k] == CH_WALL)
                        condition = false;

            if (condition)
            {
                this.addPath(randX, randY, randD);
                this.mazeGrid[randY][randX] = CH_WALL;
            }
        }

    }

    drawHorizontal(x, y, length, thickness, color)
    {
        let el = document.createElementNS(SVG_NAMESPACE, "rect");
        let svg = document.getElementById("mazeSVG");

        el.setAttribute("x", x);
        el.setAttribute("y", y);
        el.setAttribute("width", length);
        el.setAttribute("height", thickness);
        el.setAttribute("fill", color.getCode());
        el.setAttribute("rx", 10);

        svg.appendChild(el);

    }

    drawVertical(x, y, length, thickness, color)
    {
        let el = document.createElementNS(SVG_NAMESPACE, "rect");
        let svg = document.getElementById("mazeSVG");

        el.setAttribute("x", x);
        el.setAttribute("y", y);
        el.setAttribute("width", thickness);
        el.setAttribute("height", length);
        el.setAttribute("fill", color.getCode());
        el.setAttribute("rx", 10);

        svg.appendChild(el);

    }

    growPaths()
    {
        for (let path of this.paths)
        {
            if (!path.active) continue;

            if (!this.pathIsClear(path.getCheckPoint(path.direction), path.direction))
            {
                if (!path.changeDirection())
                {
                    path.active = false;
                    continue;
                }
            }

            else if (getRandom(100) < 60)
            {
                path.grow();
            }

            else
            {
                path.changeDirection();
            }

            path.active = false;

            for (let i = 1; i <= 4; ++i)
            {
                if (this.pathIsClear(path.getCheckPoint(i), i))
                    path.active = true;
            }

            for (let pt of path.points)
            {
                this.mazeGrid[pt.y][pt.x] = CH_WALL;
            }
        }

    }

    initMaze()
    {
        this.mazeGrid = [];
        this.paths = [];
        this.branches = [];

        for (let i = 0; i < this.rows; ++i)
        {
            this.mazeGrid.push([]);

            for (let j = 0; j < this.columns; ++j)
            {
                if (i == this.wall_top || i == this.wall_bottom ||
                    j == this.wall_left || j == this.wall_right)
                    this.mazeGrid[i].push(CH_WALL);
                else
                    this.mazeGrid[i].push(CH_SPACE);
            }
        }

        let startX = getRandom((this.columns - 6) / 2) * 2 + 3;
        let exitX = getRandom((this.columns - 6) / 2) * 2 + 3;

        if (startX > this.columns / 2)
            startX = startX - Math.floor(this.columns / 2);

        if (exitX < this.columns / 2)
            exitX = exitX + Math.floor(this.columns / 2);

        this.mazeGrid[this.wall_top][startX] = CH_SPACE;
        this.mazeGrid[this.wall_bottom][exitX] = CH_SPACE;

        this.startPoint = {x: startX, y: this.wall_top};
        this.exitPoint = {x: exitX, y: this.wall_bottom};

        this.addPath(this.startPoint.x - 1, this.startPoint.y + 1, 2);
        this.addPath(this.startPoint.x + 1, this.startPoint.y + 1, 2);
        this.addPath(this.exitPoint.x - 1, this.exitPoint.y - 1, 1);
        this.addPath(this.exitPoint.x + 1, this.exitPoint.y - 1, 1);

        this.startX = this.startPoint.x;
        this.startY = this.startPoint.y;
        this.exitX = this.exitPoint.x;
        this.exitY = this.exitPoint.y;

    }

    isComplete()
    {
        let result = true;

        // Horizontal set of 2 x 3 points
        for (let i = 1; i < this.rows - 2; ++i)
        {
            for (let j = 1; j < this.columns - 2; ++j)
            {
                if (this.mazeGrid[i][j] == CH_SPACE &&
                    this.mazeGrid[i][j + 1] == CH_SPACE &&
                    this.mazeGrid[i][j - 1] == CH_SPACE &&
                    this.mazeGrid[i + 1][j] == CH_SPACE &&
                    this.mazeGrid[i + 1][j + 1] == CH_SPACE &&
                    this.mazeGrid[i + 1][j - 1] == CH_SPACE)
                {
                    result = false;
                }
            }
        }

        // Vertical set of 2 x 3 points
        for (let i = 1; i < this.rows - 2; ++i)
        {
            for (let j = 1; j < this.columns - 2; ++j)
            {
                if (this.mazeGrid[i][j] == CH_SPACE &&
                    this.mazeGrid[i][j + 1] == CH_SPACE &&
                    this.mazeGrid[i - 1][j] == CH_SPACE &&
                    this.mazeGrid[i - 1][j + 1] == CH_SPACE &&
                    this.mazeGrid[i + 1][j] == CH_SPACE &&
                    this.mazeGrid[i + 1][j + 1] == CH_SPACE)
                {
                    result = false;
                }
            }
        }

        return result;

    }

    paintBackground(c)
    {

        let el = document.createElementNS(SVG_NAMESPACE, "rect");
        let svg = document.getElementById("mazeSVG");
        svg.innerHTML = "";


        el.setAttribute("x", 0);
        el.setAttribute("y", 0);
        el.setAttribute("width", SVG_WIDTH);
        el.setAttribute("height", SVG_HEIGHT);
        el.setAttribute("fill", c.getCode());

        svg.appendChild(el);

        el = document.createElementNS(SVG_NAMESPACE, "span");
        el.setAttribute("id", "gridLines");
        svg.appendChild(el);

    }

    paintGrid()
    {
        let svg = document.getElementById("mazeSVG");

        if (this.grid_visible)
        {
            let lines = document.getElementsByClassName("grid-line");

            while (lines.length > 0)
            {
                svg.removeChild(lines[0]);
            }

            // for (let line of lines)
            // {
            //     console.log("Got a line here...");
            //     svg.removeChild(line);
            // }

            this.grid_visible = false;
            document.getElementById("button_grid").innerHTML = "Show Grid";
        }

        else
        {
            let marker = document.getElementById("gridLines");
            let el = null;

            for (let i = 0; i <= this.rows; ++i)
            {
                el = document.createElementNS(SVG_NAMESPACE, "line");

                el.setAttribute("x1", 0);
                el.setAttribute("x2", SVG_WIDTH);
                el.setAttribute("y1", i * this.rowPixels);
                el.setAttribute("y2", i * this.rowPixels);
                el.setAttribute("stroke", "black");
                el.setAttribute("class", "grid-line");

                svg.insertBefore(el, marker);
            }

            for (let j = 0; j <= this.columns; ++j)
            {
                el = document.createElementNS(SVG_NAMESPACE, "line");

                el.setAttribute("x1", j * this.columnPixels);
                el.setAttribute("x2", j * this.columnPixels);
                el.setAttribute("y1", 0);
                el.setAttribute("y2", SVG_HEIGHT);
                el.setAttribute("stroke", "black");
                el.setAttribute("class", "grid-line");

                svg.insertBefore(el, marker);
            }

            this.grid_visible = true;
            document.getElementById("button_grid").innerHTML = "Hide Grid";

        }

    }

    paintMaze()
    {
        let svg = document.getElementById("mazeSVG");
        svg.innerHTML = "";
        this.paintBackground(this.spaceColor);

        // Horizontal wall sections
        for (let i = 0; i < this.rows; ++i)
        {
            let sectionLength = 0;
            let sectionX = 0;
            let sectionY = i * this.rowPixels;

            for (let j = 0; j < this.columns; ++j)
            {
                if (this.mazeGrid[i][j] == CH_WALL)
                {
                    if (sectionLength == 0)
                        sectionX = j * this.columnPixels;

                    ++sectionLength;
                }

                if (this.mazeGrid[i][j] != CH_WALL || j == this.columns - 1)
                {
                    if (sectionLength > 1)
                    {
                        this.drawHorizontal(sectionX, sectionY, sectionLength * this.columnPixels, this.rowPixels, this.wallColor);
                        // let theta = (sectionX / SVG_WIDTH) * 2 * PI;
                        // let phi = SVG_RADIUS - (radPixels * i) - (radPixels / 2);
                        // drawArc(theta, phi, sectionLength, radPixels, wallColor);
                    }

                    sectionLength = 0;
                }
            }
        }

        // Vertical wall sections
        for (let i = 0; i < this.columns; ++i)
        {
            let sectionLength = 0;
            let sectionX = i * this.columnPixels;
            let sectionY = 0;

            for (let j = 0; j < this.rows; ++j)
            {
                if (this.mazeGrid[j][i] == CH_WALL)
                {
                    if (sectionLength == 0)
                        sectionY = j * this.rowPixels;

                    ++sectionLength;
                }

                if (this.mazeGrid[j][i] != CH_WALL || j == this.rows - 1)
                {
                    if (sectionLength > 1)
                    {
                        this.drawVertical(sectionX, sectionY, sectionLength * this.rowPixels, this.columnPixels, this.wallColor);
                        // let theta = (i / (columns - 1)) * 2 * PI;
                        // let phi = SVG_RADIUS - (radPixels * (rows - j - 1));
                        // drawRadial(theta, phi, sectionLength, radPixels, wallColor);
                    } 

                    sectionLength = 0;
                }
            }
        }
        
    }

    pathIsClear(pt, dir)
    {
        let checkX = Math.max(this.wall_left, pt.x);
        let checkY = Math.max(this.wall_top, pt.y);

        checkX = Math.min(this.wall_right, checkX);
        checkY = Math.min(this.wall_bottom, checkY);

        if (this.mazeGrid[checkY][checkX] == CH_WALL)
            return false;

        switch (dir)
        {
            case 1:
            {
                if (this.mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                    this.mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                    this.mazeGrid[checkY + 1][checkX + 1] == CH_WALL ||
                    this.mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY + 1][checkX - 1] == CH_WALL)
                {
                    return false;
                }

            } break;
            
            case 2:
            {
                if (this.mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                    this.mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX + 1] == CH_WALL ||
                    this.mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX - 1] == CH_WALL)
                {
                    return false;
                }

            } break;

            case 3:
            {
                if (this.mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY + 1][checkX + 1] == CH_WALL ||
                    this.mazeGrid[checkY][checkX + 1] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX + 1] == CH_WALL)
                {   
                    return false;
                }

            } break;

            case 4:
            {
                if (this.mazeGrid[checkY + 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX] == CH_WALL     ||
                    this.mazeGrid[checkY + 1][checkX - 1] == CH_WALL ||
                    this.mazeGrid[checkY][checkX - 1] == CH_WALL     ||
                    this.mazeGrid[checkY - 1][checkX - 1] == CH_WALL)
                {   
                    return false;
                }

            } break;

            default: {} break;
        }
            
        return true;

    }

    pathsActive()
    {
        for (let path of this.paths)
        {
            if (path.active)
                return true;
        }

        return false;

    }

    randomizeColors()
    {
        let spaceRed = getRandom(40) + 190;
        let spaceGreen = getRandom(40) + 190;
        let spaceBlue = getRandom(40) + 190;

        let wallRed = 255 - spaceRed;
        let wallGreen = 255 - spaceGreen;
        let wallBlue = 255 - spaceBlue;

        this.wallColor = new ColorRGB(wallRed, wallGreen, wallBlue);
        this.spaceColor = new ColorRGB(spaceRed, spaceGreen, spaceBlue);
        // this.spaceColor = new ColorRGB(255, 255, 255);

    }



}













