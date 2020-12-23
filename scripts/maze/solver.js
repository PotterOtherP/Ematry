class Solver {
    
    constructor(maze, color)
    {
        this.color = color;
        this.maze = maze;

        this.grid = [];
        this.path = [{x: maze.startX, y: maze.startY}];
        this.direction = 2;

    }

    solveMaze()
    {
        let while_control = 0;

        while (!this.isSolved())
        {
            if (while_control > 10000)
                break;
            ++while_control;

            this.iterate();
        }
    }

    isSolved()
    {
        return (this.getX() === maze.exitX && this.getY() === maze.exitY());
    }


    iterate()
    {
        if (!this.advance())
            this.retreat();
    }

    advance()
    {
        switch (this.direction)
        {
            case 1:
            {

            } break;

            case 2:
            {

            } break;

            case 3:
            {

            } break;

            case 4:
            {

            } break;

            default: { return false; }
        }

        return false;
    }

    retreat()
    {

    }

    getX()
    {
        return this.path[this.path.length - 1].x;
    }

    getY()
    {
        return this.path[this.path.length - 1].y;
    }
}