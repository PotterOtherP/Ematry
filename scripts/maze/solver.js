const MAX_SOLUTION_ITERATIONS = 50000;

class Solver {


    constructor(maze, orient)
    {
        this.maze = maze;

        this.grid = [];
        this.path = [{x: maze.startX, y: maze.startY}];
        this.direction = 2;
        this.orientation = orient;

        if (this.orientation < 0 || this.orientation > 2)
            this.orientation = 1;
        
        this.setColor();


        for (let i = 0; i < this.maze.rows; ++i)
        {
            this.grid.push([]);
            for (let j = 0; j < this.maze.columns; ++j)
            {
                this.grid[i].push(this.maze.mazeGrid[i][j]);
            }
        }



    }

    advanceRight()
    {
        let sx = this.getX();
        let sy = this.getY();

        switch (this.direction)
        {
            case 1:
            {
                // Right
                if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

            } break;

            case 2:
            {
                // Left
                if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

            } break;

            case 3:
            {
                // Up
                if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

            } break;

            case 4:
            {
                // Down
                if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }
            } break;

            default: { return false; }
        }

        return false;

    }

    advanceLeft()
    {
        let sx = this.getX();
        let sy = this.getY();

        switch (this.direction)
        {
            case 1:
            {
                // Left
                if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }



            } break;

            case 2:
            {
                // Right
                if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }



            } break;

            case 3:
            {
                // Down
                if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }



            } break;

            case 4:
            {
                // Up
                if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }


            } break;

            default: { return false; }
        }

        return false;

    }

    draw()
    {
        let el = document.createElementNS(SVG_NAMESPACE, "polyline");
        let svg = document.getElementById("mazeSVG");
        
        let elPrevious = document.getElementById("solverPL");

        if (elPrevious != null) svg.removeChild(elPrevious);


        let pointsStr = "";

        for (let pt of this.path)
        {
            let px = this.maze.columnPixels * (pt.x + 1 / 2);
            let py = this.maze.rowPixels * (pt.y + 1 / 2);
            pointsStr += (px + "," + py + " ");
        }

        el.setAttribute("points", pointsStr);
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", this.color.getCode());
        el.setAttribute("stroke-width", this.maze.columnPixels);
        el.setAttribute("stroke-opacity", 0.5);
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("id", "solverPL");
        svg.appendChild(el);

    }

    hide()
    {
        let svg = document.getElementById("mazeSVG");        
        let elPrevious = document.getElementById("solverPL");

        if (elPrevious != null) svg.removeChild(elPrevious);

    }

    isSolved()
    {
        return (this.getX() === this.maze.exitX && this.getY() === this.maze.exitY);
    }

    iterate()
    {
        switch (this.orientation)
        {
            // Picks right or left randomly
            case 0:
            {
                let roll = getRandom(2);
                if (roll == 0)
                {
                    if (!this.advanceRight()) this.retreat();
                }

                else
                {
                    if (!this.advanceLeft()) this.retreat();
                }
            } break;

            // Always goes right
            case 1:
            {
                if (!this.advanceRight()) this.retreat();
            } break;

            // Always goes left
            case 2:
            {
                if (!this.advanceLeft()) this.retreat();
            } break;

            default: {} break;
        }

    }

    retreat()
    {

        this.grid[this.getY()][this.getX()] = CH_WALL;

        this.path.pop();

        if (this.getX() > this.getPrevX())
            this.direction = 4;

        if (this.getX() < this.getPrevX())
            this.direction = 3;

        if (this.getY() > this.getPrevY())
            this.direction = 2;

        if (this.getY() < this.getPrevY())
            this.direction = 1;

    }

    solveMaze()
    {
        let while_control = 0;

        while (!this.isSolved())
        {
            if (while_control > MAX_SOLUTION_ITERATIONS)
            {
                console.log("Solver reached maximum iterations.");
                break;
            }
            ++while_control;

            this.iterate();

            if (this.isSolved())
            {
                console.log("Solved in " + while_control + " iterations.");
            }
        }

    }

    getX()
    {
        return this.path[this.path.length - 1].x;
    }

    getY()
    {
        return this.path[this.path.length - 1].y;
    }

    getPrevX()
    {
        return this.path[this.path.length - 2].x;
    }

    getPrevY()
    {
        return this.path[this.path.length - 2].y;
    }

    setColor()
    {
        this.color = new ColorRGB(10, 10, 210);

        if (this.orientation == 0)
            this.color = new ColorRGB(210, 10, 10);

        if (this.orientation == 2)
            this.color = new ColorRGB(10, 210, 10);
    }
}