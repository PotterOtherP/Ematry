const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let newMaze = null;

function generate()
{
    console.log("Generate function!");

    newMaze = new Maze(document.getElementById("complexity-select").value);

    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    document.getElementById("button_save").removeAttribute("disabled");

    document.getElementById("button_solve").addEventListener("click", playerSolve);
    // document.getElementById("button_solution").addEventListener("click", computerSolve);
    // document.getElementById("button_race").addEventListener("click", race);
    // document.getElementById("button_save").addEventListener("click", save);

}

function getRandom(int)
{
    return Math.floor(Math.random() * int);
}

function playerSolve()
{
    player = new WallPath(startPoint.x, startPoint.y, 2);
    playerColor = new ColorRGB(255, 20, 147);
    playerTipColor = new ColorRGB(0, 255, 255);
    player.grow();

    // window.addEventListener("mousemove", mouse, true);
    window.addEventListener("keydown", keyDown, true);

    drawPlayer();

}

function keyDown(event)
{
    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    if (checkX == exitPoint.x && checkY == exitPoint.y)
    {
        console.log("Maze solved!");
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

    if (player.points.length > 2 &&
        (checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y) )
    {
        player.points.pop();
    }



    else if (player.direction > 0 && mazeGrid[checkY][checkX] !== CH_WALL)
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

function drawHorizontal(x, y, length, thickness, color)
{
    let el = document.createElementNS("http:///www.w3.org/2000/svg", "rect");
    let svg = document.getElementById("mazeSVG");

    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", length);
    el.setAttribute("height", thickness);
    el.setAttribute("fill", color.getCode());
    el.setAttribute("rx", 10);

    svg.appendChild(el);

}

function drawPlayer()
{
    let el = document.createElementNS(namespace, "polyline");
    let el_tip1 = document.createElementNS(namespace, "circle");
    let el_tip2 = document.createElementNS(namespace, "circle");
    let svg = document.getElementById("mazeSVG");
    
    let elPrevious = document.getElementById("playerPL");
    let elPrevious_t1 = document.getElementById("player_t1");
    let elPrevious_t2 = document.getElementById("player_t2");

    if (elPrevious != null) svg.removeChild(elPrevious);
    if (elPrevious_t1 != null) svg.removeChild(elPrevious_t1);
    if (elPrevious_t2 != null) svg.removeChild(elPrevious_t2);


    let pointsStr = "";

    for (let pt of player.points)
    {
        let px = columnPixels * (pt.x + 1 / 2);
        let py = rowPixels * (pt.y + 1 / 2);
        pointsStr += (px + "," + py + " ");
    }

    el.setAttribute("points", pointsStr);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", playerColor.getCode());
    el.setAttribute("stroke-width", columnPixels);
    el.setAttribute("id", "playerPL");
    svg.appendChild(el);

    let t1_x = columnPixels * (player.points[0].x + 1 / 2);
    let t1_y = rowPixels * (player.points[0].y + 1 / 2);
    el_tip1.setAttribute("cx", t1_x);
    el_tip1.setAttribute("cy", t1_y);
    el_tip1.setAttribute("r", columnPixels / 2);
    el_tip1.setAttribute("fill", playerColor.getCode());
    el_tip1.setAttribute("id", "player_t1");
    svg.appendChild(el_tip1);


    let t2_x = columnPixels * (player.points[player.points.length - 1].x + 1 / 2);
    let t2_y = rowPixels * (player.points[player.points.length - 1].y + 1 / 2);
    el_tip2.setAttribute("cx", t2_x);
    el_tip2.setAttribute("cy", t2_y);
    el_tip2.setAttribute("r", columnPixels / 2);
    el_tip2.setAttribute("fill", playerTipColor.getCode());
    el_tip2.setAttribute("id", "player_t2");
    svg.appendChild(el_tip2);

}

function pointEquals(p1, p2)
{
    return (p1.x == p2.x && p1.y == p2.y);
}



window.onload = function()
{
    console.log("Maze window loaded!");
    document.getElementById("button_generate").addEventListener("click", generate);
}