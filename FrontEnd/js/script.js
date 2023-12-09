import service from "./service.js";
import toast from "./toast.js";
import { DEFAULT_MONEY, DEFAULT_RANGE, START_AIRPORT_ICAO } from "./env.js";
import spinner from "./spinner.js";

const airportNameDisplay = document.querySelector(".airport-name");
const icaoDisplay = document.querySelector(".icao");
const moneyDisplay = document.querySelector(".money");
const rangeDisplay = document.querySelector(".range");
const playerNameInput = document.getElementById("screen-name");
const startButton = document.getElementById("start-button");
const buyButton = document.getElementById("buy-button");
const airportsList = document.querySelector("#airports-list");
const destinationInput = document.getElementById("icao-code");
const submitDestinationButton = document.getElementById("submit-icao-button");
const secretBoxButtons = document.querySelectorAll(".game-secret-box-buttons");
const restartButtons = document.querySelectorAll(".restart-button");
const resourceExchange = document.getElementById("resource-exchange");
const gameRule = document.getElementById("game-rule");
const gameRuleModal = document.getElementById("game-rule-modal");
const gameRuleBody = gameRuleModal.querySelector(".modal-body");
const arivedAirportName = document.getElementById('arrivedAirportName');

let money;
let range;
let currentAirportCode;
let gameId;
let isWon = false;
let goal;
let allAirports;
let curAirportName

startButton.addEventListener("click", startGame);
buyButton.addEventListener("click", buyFuel);
submitDestinationButton.addEventListener("click", submitDestination);
secretBoxButtons.forEach(elm => {
    elm.addEventListener("click", handleSecretBox);
})
restartButtons.forEach(restartButton => {
    restartButton.addEventListener("click", main);
})
gameRule.addEventListener("click", showGameRule);

async function startGame(event) {
    event.preventDefault();
    const playerName = playerNameInput.value;
    if (!playerName) {
        toast.error("Please enter a player name.");
        return;
    }
    spinner.show();
    allAirports = await service.getAirports();
    const startAirport = await service.startAirport();
    currentAirportCode = startAirport[0].ident;

    gameId = await service.createGame({
        'start_money': money,
        'p_range': range,
        'cur_airport': currentAirportCode,
        'p_name': playerName,
        'a_ports': allAirports
    });
    await intervalGame();
    spinner.hide();
}

async function intervalGame() {
    const airport = await service.getAirportInfo(currentAirportCode);
    airportNameDisplay.textContent = airport.name;
    curAirportName = airport.name;

    goal = await service.checkGoal({ gameId: gameId.game_id, currentAirport: currentAirportCode });
    if (goal) {
        showElement("game-secret-box");
        return;
    }

    if (money > 0 && !isWon) {
        showElement("game-resource-update");
        return;
    }
    const ap = await service.airportInRange({ icao: currentAirportCode, airports: allAirports, playerRange: range });
    if (ap.length === 0) {
        gameOver();
        return;
    }
    await showAirportsInRange(ap);
}

async function showAirportsInRange(airports) {
    airportsList.innerHTML = "";

    for (const airport of airports) {
        const listItem = document.createElement("li");
        const distance = await service.calculateDistance(currentAirportCode, airport.ident);
        listItem.textContent = `${airport.name} (ICAO: ${airport.ident}), distance: ${distance.distance}`;
        airportsList.appendChild(listItem);
    }
    showElement("game-destination");
}

async function buyFuel(event) {
    event.preventDefault();
    const fuelAmount = parseFloat(resourceExchange.value);
    if (isNaN(fuelAmount) || fuelAmount < 0) {
        toast.error("Please enter a valid non-negative number for fuel.");
        return;
    }
    if (fuelAmount > money) {
        toast.error('You don\'t have enough money. ');
        return;
    }
    range += fuelAmount * 2;
    money -= fuelAmount;
    updateDisplay();
    spinner.show();
    const ap = await service.airportInRange({ icao: currentAirportCode, airports: allAirports, playerRange: range });
    if (ap.length === 0) {
        gameOver();
        return;
    }
    await showAirportsInRange(ap);
    spinner.hide();
}

async function submitDestination(event) {
    event.preventDefault();
    const selectedDestination = destinationInput.value;
    if (!selectedDestination) {
        toast.error("Please enter a valid destination.");
        return;
    }
    const dest = await service.calculateDistance(currentAirportCode, selectedDestination)
    range -= dest.distance;
    spinner.show();
    await service.updateLocation({
        'icao': selectedDestination,
        'p_range': range,
        'u_money': money,
        'g_id': gameId.game_id
    });
    currentAirportCode = selectedDestination;
    updateDisplay();
    if (range < 0 || isWon) {
        gameOver();
    }
    spinner.hide();
    await intervalGame();
    arivedAirportName.textContent = curAirportName;
}

async function handleSecretBox(event) {
    const clickedButton = event.target.id;

    if (clickedButton !== "skip") {
        if (clickedButton === "money") {
            money -= 100;
        } else if (clickedButton === "range") {
            range -= 50;
        }
            console.log(goal);
        if (goal.money > 0) {
            money += goal.money;
            toast.success(`${goal.name}. Tha is worth ${goal.money}EURO`)
        } else if (goal?.money === 0) {
            isWon = true;
            toast.success('Congurations! You found the Mona Lisa. Now go to start. You get 6000km in range from Interpool.')
            range += 6000;
        } else {
            money /= 2;
            toast.success('Oh no! You have been hacked. You lost half you money');
        }
        updateDisplay();
    }
    if (money > 0 && !isWon) {
        showElement("game-resource-update");
        return;
    }

    const ap = await service.airportInRange({ icao: currentAirportCode, airports: allAirports, playerRange: range });
    if (ap.length === 0) {
        gameOver();
        return;
    }
    showAirportsInRange(ap);
}

function showElement(elementClass) {
    const elements = document.querySelectorAll(
        ".game-resource-update, .game-destination, .game-secret-box, .game-win, .game-rules, .intro, .game-lost, .out-range",
    );
    elements.forEach((element) => {
        element.classList.add("fadeOut");
    });

    const targetElement = document.querySelector(`.${elementClass}`);
    if (targetElement) {
        targetElement.classList.remove("fadeOut");
    }
}

function updateDisplay() {
    moneyDisplay.textContent = money.toFixed(0);
    rangeDisplay.textContent = range.toFixed(0);
    icaoDisplay.textContent = currentAirportCode;
}

function showGameRule() {
    spinner.show();
    service
        .getStory()
        .then(({ story }) => {
            spinner.hide();
            const myModal = new bootstrap.Modal(gameRuleModal);
            myModal.show();
            gameRuleBody.textContent = story;
        })
        .catch(() => spinner.hide());
}

function gameOver() {
    if (isWon) {
        showElement("game-win");
    } else {
        showElement("game-lost");
    }
    spinner.hide();
}

function main() {
    money = DEFAULT_MONEY;
    range = DEFAULT_RANGE;
    currentAirportCode = START_AIRPORT_ICAO;
    showElement("intro");
    updateDisplay();
}

main();

