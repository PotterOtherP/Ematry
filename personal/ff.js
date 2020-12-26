function run()
{
    console.log("Hey bucket head!");

    let jobs = [

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

    let rollButton = document.getElementById("roll");
    rollButton.addEventListener("click", run);

    let el = document.getElementById("vaan");
    let x = getRandom(jobs.length);
    el.innerHTML = "Vaan: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    el = document.getElementById("penelo");
    x = getRandom(jobs.length);
    el.innerHTML = "Penelo: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    el = document.getElementById("balthier");
    x = getRandom(jobs.length);
    el.innerHTML = "Balthier: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    el = document.getElementById("fran");
    x = getRandom(jobs.length);
    el.innerHTML = "Fran: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    el = document.getElementById("basch");
    x = getRandom(jobs.length);
    el.innerHTML = "Basch: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    el = document.getElementById("ashe");
    x = getRandom(jobs.length);
    el.innerHTML = "Ashe: " + jobs[x];
    jobs = remove(jobs, x);
    console.log(jobs);

    
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


window.onload = function()
{
    run();
}