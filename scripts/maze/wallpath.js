class WallPath {

    /**
     *  Direction codes:
     *  
     *  Up - 1
     *  Down - 2
     *  Left - 3
     *  Right  - 4
     */

    constructor(startX, startY, dir)
    {
        this.direction = dir;
        this.points = [];
        this.active = true;
        this.points.push( { x: startX, y: startY} );

    }

    branch()
    {
        let index = getRandom(this.points.length - 2) + 1;

        let nx = this.points[index].x;
        let ny = this.points[index].y;

        let dirNew = 1;

        let gUp = { x: nx, y: ny - 1 };
        let gDown = { x: nx, y: ny + 1 };
        let gLeft = { x: nx - 1, y: ny };
        let gRight = { x: nx + 1, y: ny };

        // Path is vertical
        if ( (pointEquals(this.points[index - 1], gUp) && pointEquals(this.points[index + 1], gDown)) ||
             (pointEquals(this.points[index + 1], gUp) && pointEquals(this.points[index - 1], gDown)) )
        {
            let roll = getRandom(2);

            nx = (roll == 0 ? nx + 1 : nx - 1);
            dirNew = (roll == 0 ? 4 : 3);

            return new WallPath(nx, ny, dirNew);
        }

        // Path is horizontal
        if ( (pointEquals(this.points[index - 1], gLeft) && pointEquals(this.points[index + 1], gRight)) ||
             (pointEquals(this.points[index + 1], gLeft) && pointEquals(this.points[index - 1], gRight)) )
        {
            let roll = getRandom(2);

            ny = (roll == 0 ? ny + 1 : ny - 1);
            dirNew = (roll == 0 ? 2 : 1);

            return new WallPath(nx, ny, dirNew);
        }

        // Corner, upper right
        if ( (pointEquals(this.points[index - 1], gUp) && pointEquals(this.points[index + 1], gRight)) ||
             (pointEquals(this.points[index + 1], gUp) && pointEquals(this.points[index - 1], gRight)) )
        {
            let roll = getRandom(2);

            nx = (roll == 0 ? nx - 1 : nx);
            ny = (roll == 0 ? ny : ny + 1);
            dirNew = (roll == 0 ? 3 : 2);

            return new WallPath(nx, ny, dirNew);
        }

        // Corner, upper left
        if ( (pointEquals(this.points[index - 1], gUp) && pointEquals(this.points[index + 1], gLeft)) ||
             (pointEquals(this.points[index + 1], gUp) && pointEquals(this.points[index - 1], gLeft)) )
        {
            let roll = getRandom(2);

            nx = (roll == 0 ? nx + 1 : nx);
            ny = (roll == 0 ? ny : ny + 1);
            dirNew = (roll == 0 ? 4 : 2);

            return new WallPath(nx, ny, dirNew);
        }

        // Corner, lower right
        if ( (pointEquals(this.points[index - 1], gDown) && pointEquals(this.points[index + 1], gRight)) ||
             (pointEquals(this.points[index + 1], gDown) && pointEquals(this.points[index - 1], gRight)) )
        {
            let roll = getRandom(2);

            nx = (roll == 0 ? nx - 1 : nx);
            ny = (roll == 0 ? ny : ny - 1);
            dirNew = (roll == 0 ? 3 : 1);

            return new WallPath(nx, ny, dirNew);
        }

        // Corner, lower right
        if ( (pointEquals(this.points[index - 1], gDown) && pointEquals(this.points[index + 1], gLeft)) ||
             (pointEquals(this.points[index + 1], gDown) && pointEquals(this.points[index - 1], gLeft)) )
        {
            let roll = getRandom(2);

            nx = (roll == 0 ? nx + 1 : nx);
            ny = (roll == 0 ? ny : ny - 1);
            dirNew = (roll == 0 ? 4 : 1);

            return new WallPath(nx, ny, dirNew);
        }

        return new WallPath(nx, ny, dirNew);

    }

    changeDirection()
    {
        let roll = getRandom(2);

        switch (this.direction)
        {
            case 1:
            case 2:
            {
                this.direction = (roll == 0 ? 3 : 4);
            } break;

            case 3:
            case 4:
            {
                this.direction = (roll == 0 ? 1 : 2);
            } break;

            default: {} break;

        }

    }

    checkActive()
    {
        let roll = getRandom(100) + 1;

        if (this.points.length > 10 && roll < points.length * 2)
            this.active = false;
        
    }

    getBranchCheckPoint()
    {
        let checkX = this.points[0].x;
        let checkY = this.points[0].y;

        switch (this.direction)
        {
            case 1:
            {
                return { x: checkX, y: checkY - 1 };
            } // break;

            case 2:
            {
                return { x: checkX, y: checkY + 1 };
            } // break;

            case 3:
            {
                return { x: checkX - 1, y: checkY };
            } // break;

            case 4:
            {
                return { x: checkX + 1, y: checkY };
            } // break;
            
            default: {  return null; } // break;
        }

    }

    getCheckPoint()
    {
        let checkX = this.points[this.points.length - 1].x;
        let checkY = this.points[this.points.length - 1].y;

        switch (this.direction)
        {
            case 1:
            {
                return { x: checkX, y: checkY - 2 };
            } // break;

            case 2:
            {
                return { x: checkX, y: checkY + 2 };
            } // break;

            case 3:
            {
                return { x: checkX - 2, y: checkY };
            } // break;

            case 4:
            {
                return { x: checkX + 2, y: checkY };
            } // break;
            
            default: {  return null; } // break;
        }

    }

    grow()
    {
        let newX = this.points[this.points.length - 1].x;
        let newY = this.points[this.points.length - 1].y;

        switch (this.direction)
        {
            case 1:
            {
                --newY;
                this.points.push({x: newX, y: newY });
            } break;

            case 2:
            {
                ++newY;
                this.points.push({x: newX, y: newY });
            } break;

            case 3:
            {
                --newX;
                this.points.push({x: newX, y: newY });
            } break;

            case 4:
            {
                ++newX;
                this.points.push({x: newX, y: newY });
            } break;

            default: {} break;
        }

    }

    rotateClockwise()
    {
        switch (this.direction)
        {
            case 1: { this.direction = 4; } break;
            case 2: { this.direction = 3; } break;
            case 3: { this.direction = 1; } break;
            case 4: { this.direction = 2; } break;
            default: { } break;
        }

    }

    rotateCounterclockwise()
    {
        switch (this.direction)
        {
            case 1: { this.direction = 3; } break;
            case 2: { this.direction = 4; } break;
            case 3: { this.direction = 2; } break;
            case 4: { this.direction = 1; } break;
            default: { } break;
        }

    }


}