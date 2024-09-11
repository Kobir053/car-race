// list of the future intervals 
let intervals = [];
// list of cars that finished the race
let finishTimeOfRace = [];
// time of start race
let startTime;
// get the input and button elements
const input = document.querySelector("header > .set-race-div > input");
const startBTN = document.querySelector("header > .set-race-div > button");
// set listener for the button, when its clicked it starts a race
startBTN.addEventListener("click", ()=>{
    let choise = input.value;
    if(choise > 4 || choise < 2){
        alert("the game is between 2 to 4 players..");
        return;
    }
    // stops the exsits intervals
    stopAllIntervals();
    // starts the race with the number of cars the user entered
    startRace(choise);
})

// remove the main element from the body and stops existing intervals
const reset = () => {
    const main = document.querySelector("main");
    document.body.removeChild(main);
    stopAllIntervals(); 
}

// render the html for the race, set interval for every car, and set interval to check if last car finished the race
const startRace = (numOfPlayers) =>{

    // render the html for the race with amount of cars the user choose
    renderHtmlForRace(numOfPlayers);

    // set it to empty array to handle reset situation
    finishTimeOfRace = [];

    const date = new Date();
    startTime = date.getTime();

    // set interval for all cars
    for(let i = 1;i <= numOfPlayers;i++){
        // interval for each car that moves the car or set its finish time (depends if the car finished or not)
        const newInterval = setInterval(()=>{
            if(!carFinished(i)){
                // move the car on the race
                moveCar(i);
            }
            else{
                // 
                setFinishTimeForCar(i);
            }
        }, 20);
        // insert the intervalID for array of intervals
        intervals.push(newInterval);
    }
    // interval that checks if the last car got to the finish line, if it did - stops the intervals and show the results of the race
    const endRace = setInterval(() => {
        if(allFinished(numOfPlayers)){
            stopAllIntervals();
            showResults();
        }
    },10);
    // insert the intervalID for array of intervals
    intervals.push(endRace);
}

// get the car position and the finish-line position and check if the car got to the finish-line
const carFinished = (carId) => {
    const carElement = document.getElementById(`car${carId}`);
    const lineElement = document.getElementById(`line${carId}`);
    const carPosition = getPositionInNumber(carElement);
    const linePosition = getPositionInNumber(lineElement);
    if(carPosition < linePosition)
        return false;
    return true;
}

// check if the "finishTimeOfRace" array is full with the cars, if it is that means all cars finished and return true
const allFinished = (numOfPlayers) => {
    if(finishTimeOfRace.length == numOfPlayers)
        return true;
    return false;
}

// set the time that the car finished the race
const setFinishTimeForCar = (carID) => {
    // check if the car is already in the array of the cars that finished
    if(finishTimeOfRace.findIndex(item => item.id == carID) != -1)
        return;
    const date = new Date();
    let finishTime = {
        id: carID,
        time: date.getTime()
    };

    finishTimeOfRace.push(finishTime);
}

// iterate through array of end-time of the cars and set <p> with the details into a results-div and append the div to our <main>
const showResults = () => {

    const main = document.querySelector("main");
    const divResults = document.createElement("div");

    for(let i = 0;i < finishTimeOfRace.length;i++){
        let duration = (finishTimeOfRace[i].time - startTime) / 1000;
        let stringToShow = `${i+1}. racer${finishTimeOfRace[i].id} completed round in ${duration} seconds!`;
        const newParagraph = document.createElement("p");
        newParagraph.textContent = stringToShow;
        divResults.appendChild(newParagraph);
    }

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click", reset);
    divResults.appendChild(resetButton);
    main.appendChild(divResults);
}

// Stop all running intervals and clean the array of intervals
const stopAllIntervals = () => {
    intervals.forEach(intervalID => clearInterval(intervalID));
    intervals = []; 
}

// add the "left" property a random number of pixels
const moveCar = (carID) =>{
    const myCar = document.getElementById(`car${carID}`);
    const currentLeftPosition = getPositionInNumber(myCar);
    const randNum = Math.floor(Math.random() * 20);
    myCar.style.left = `${currentLeftPosition + randNum}px`;
}

// remove the old main element from the body and recreate it with the tracks and the cars
const renderHtmlForRace = (numOfPlayers) => {
    let oldMain = document.querySelector("main");
    if(oldMain != null)
        document.body.removeChild(oldMain);
    const main = document.createElement("main");
    for(let i = 1;i <= numOfPlayers;i++){
        let newCarDiv = setCarDiv(i);
        main.appendChild(newCarDiv);
    }
    document.body.appendChild(main);
}

// set div for car with car and finish-line and set its id by the number of the car
const setCarDiv = (carNumber) => {
    const carDiv = document.createElement("div");
    const carElement = document.createElement("div");
    const finishLineDiv = document.createElement("div");
    // set attributes for css and manipulation
    carDiv.setAttribute("class", "car-box");
    carElement.setAttribute("class", "car");
    carElement.setAttribute("id", `car${carNumber}`);
    carElement.style.left = "0px";
    finishLineDiv.setAttribute("class", "finish-line");
    finishLineDiv.setAttribute("id", `line${carNumber}`);

    carDiv.append(carElement, finishLineDiv);
    return carDiv;
}

// get position of element on the window by the "left" property
const getPositionInNumber = (element) => {
    let stringPosition = window.getComputedStyle(element).left;
    let positionInNumber = parseFloat(stringPosition.substring(0, stringPosition.indexOf("p")));
    return positionInNumber;
}