class MazeNode {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        this.entrance = false;
        this.exit = false;

        this.parents = [];
        this.children = [];

        this.deadEnd = false;
    }

    addNewChild(x, y)
    {
        const childNode = new MazeNode(x, y);
        childNode.parents.push(this);
        this.children.push(childNode);
    }

    display(ctx)
    {
        ctx.fillStyle = "ff0000";
        // console.log("(" + this.x + ", " + this.y + ")");
        ctx.fillRect(this.x - 2, this.y - 2, 4, 3);

        for (let child of this.children)
        {
            // console.log("(" + child.x + ", " + child.y + ")");
            ctx.fillRect(child.x - 2, child.y - 2, 4, 3);
        }
    }
    
}