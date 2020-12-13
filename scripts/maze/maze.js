function getRandom(int)
{
    return Math.floor(Math.random() * int);
}

function generate()
{
    console.log("Generate function!");


    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    document.getElementById("button_convert").removeAttribute("disabled");
    document.getElementById("button_save").removeAttribute("disabled");
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