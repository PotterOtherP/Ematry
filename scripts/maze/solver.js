class Solver {
    
    constructor(maze, color)
    {
        this.color = color;
        this.maze = maze;

        this.grid = [];
        this.path = [{x: maze.startX, y: maze.startY}];
        this.direction = 2;

        for (let i = 0; i < this.maze.rows; ++i)
        {
            this.grid.push([]);
            for (let j = 0; j < this.maze.columns; ++j)
            {
                this.grid[i].push(this.maze.mazeGrid[i][j]);
            }
        }

        this.solveMaze();
        this.draw();

    }

    draw()
    {
        let el = document.createElementNS(SVG_NAMESPACE, "polyline");
        let el_tip1 = document.createElementNS(SVG_NAMESPACE, "circle");
        let el_tip2 = document.createElementNS(SVG_NAMESPACE, "circle");
        let svg = document.getElementById("mazeSVG");
        
        let elPrevious = document.getElementById("solverPL");
        let elPrevious_t1 = document.getElementById("solver_t1");
        let elPrevious_t2 = document.getElementById("solver_t2");

        if (elPrevious != null) svg.removeChild(elPrevious);
        if (elPrevious_t1 != null) svg.removeChild(elPrevious_t1);
        if (elPrevious_t2 != null) svg.removeChild(elPrevious_t2);


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
        el.setAttribute("id", "solverPL");
        svg.appendChild(el);

        let t1_x = this.maze.columnPixels * (this.path[0].x + 1 / 2);
        let t1_y = this.maze.rowPixels * (this.path[0].y + 1 / 2);
        el_tip1.setAttribute("cx", t1_x);
        el_tip1.setAttribute("cy", t1_y);
        el_tip1.setAttribute("r", this.maze.columnPixels / 2);
        el_tip1.setAttribute("fill", this.color.getCode());
        el_tip1.setAttribute("fill-opacity", 0.5);
        el_tip1.setAttribute("id", "solver_t1");
        svg.appendChild(el_tip1);


        let t2_x = this.maze.columnPixels * (this.getX() + 1 / 2);
        let t2_y = this.maze.rowPixels * (this.getY() + 1 / 2);
        el_tip2.setAttribute("cx", t2_x);
        el_tip2.setAttribute("cy", t2_y);
        el_tip2.setAttribute("r", this.maze.columnPixels / 2);
        el_tip2.setAttribute("fill", this.color.getCode());
        el_tip1.setAttribute("fill-opacity", 0.5);
        el_tip2.setAttribute("id", "solver_t2");
        svg.appendChild(el_tip2);
    }

    solveMaze()
    {
        let while_control = 0;

        while (!this.isSolved())
        {
            if (while_control > 50000)
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

    isSolved()
    {
        return (this.getX() === this.maze.exitX && this.getY() === this.maze.exitY);
    }


    iterate()
    {
        if (!this.advance())
            this.retreat();

    }

    advance()
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
}