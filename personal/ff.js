let jobs = [];
let twoJobs = false;

function roll()
{
    jobs = shuffle(jobs);
    

    let el = document.getElementById("vaan");
    el.innerHTML = "Vaan: " + jobs[0] + (twoJobs? (" + " + jobs[6]) : "");

    el = document.getElementById("penelo");
    el.innerHTML = "Penelo: " + jobs[1] + (twoJobs? (" + " + jobs[7]) : "");

    el = document.getElementById("balthier");
    el.innerHTML = "Balthier: " + jobs[2] + (twoJobs? (" + " + jobs[8]) : "");

    el = document.getElementById("fran");
    el.innerHTML = "Fran: " + jobs[3] + (twoJobs? (" + " + jobs[9]) : "");

    el = document.getElementById("basch");
    el.innerHTML = "Basch: " + jobs[4] + (twoJobs? (" + " + jobs[10]) : "");

    el = document.getElementById("ashe");
    el.innerHTML = "Ashe: " + jobs[5] + (twoJobs? (" + " + jobs[11]) : "");

    
}

function rollOne()
{
    twoJobs = false;
    roll();
}

function rollTwo()
{
    twoJobs = true;
    roll();
}

function getRandom(n)
{
    return Math.floor(Math.random() * n);
}

function remove(arr, n)
{
    let newArr = [];

    for (let i = 0; i < arr.length; ++i)
    {
        if (i !== n)
            newArr.push(arr[i]);
    }

    return newArr;
}

function shuffle(arr)
{
    let result = [];

    while (arr.length > 0)
    {
        let n = getRandom(arr.length);
        result.push(arr[n]);
        arr = remove(arr, n);

    }

    return result;
}


window.onload = function()
{
    console.log("Hey bucket head!");

    jobs = [

        "White Mage",
        "Uhlan",
        "Monk",
        "Time Battlemage",
        "Shikari",
        "Machinist",
        "Knight",
        "Black Mage",
        "Red Battlemage",
        "Bushi",
        "Archer",
        "Foebreaker"
    ];

    let rollButton = document.getElementById("roll-1");
    rollButton.addEventListener("click", rollOne);

    let rollButtonTwo = document.getElementById("roll-2");
    rollButtonTwo.addEventListener("click", rollTwo);
}