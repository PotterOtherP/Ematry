class MazeNode {

    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        this.entrance = false;
        this.exit = false;

        this.parents = [];
        this.childen = [];

        this.deadEnd = false;
    }

    addNewChild(x, y)
    {
        const childNode = new MazeNode(x, y);
        childNode.parents.push(this);
        this.children.push(childNode);
    }
    
}