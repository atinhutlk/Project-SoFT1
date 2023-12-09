const apiUrl = 'http://127.0.0.1:5000/';
document.addEventListener("DOMContentLoaded", function () {
    const startMoney = 1000;
    const startRange = 2000;
    const startAirportICAO = "LFPG";

    let money = startMoney;
    let range = startRange;
    let currentAirportICAO = startAirportICAO;

    const moneyDisplay = document.querySelector(".money");
    const rangeDisplay = document.querySelector(".range");
    const playerNameInput = document.getElementById("screen-name");
    const startButton = document.getElementById("start-button");
    const buyButton = document.getElementById("buy-button");
    const airportsList = document.querySelector(".game-destination ul");
    const destinationInput = document.getElementById("icao-code");
    const submitDestinationButton = document.getElementById("submit-icao-button");
    const secretBoxButtons = document.querySelector(".game-secret-box-buttons");
    const restartButton = document.getElementById("restart-button");

    startButton.addEventListener("click", startGame);
    buyButton.addEventListener("click", buyFuel);
    submitDestinationButton.addEventListener("click", submitDestination);
    secretBoxButtons.addEventListener("click", handleSecretBox);
    restartButton.addEventListener("click", restartGame);

    function startGame(event) {
        event.preventDefault();
        const playerName = playerNameInput.value;
        if (playerName) {
            alert(`Welcome, ${playerName}! Your adventure begins at ${startAirportICAO}.`);
            showElement("game-resource-update");
            getAirports(); // Call the function to get airports
        } else {
            alert("Please enter a player name.");
        }
    }

    async function getAirports() {
        let urlGetAirports = apiUrl + 'get_airports';
        try {
            const response = await fetch(urlGetAirports, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Error retrieving airports');
            }
            const airports = await response.json();
            showAirportsInRange(airports);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    function showAirportsInRange(airports) {
        airportsList.innerHTML = "";

        airports.forEach(airport => {
            const listItem = document.createElement("li");
            listItem.textContent = `${airport.name} (ICAO: ${airport.ident})`;
            airportsList.appendChild(listItem);
        });
        showElement("game-destination");
    }

    async function buyFuel(event) {
        event.preventDefault();
        const fuelAmount = parseFloat(document.getElementById("resource-exchange").value);
        let urlBuyFuel = apiUrl + 'buy_fuel';
        if (!isNaN(fuelAmount) && fuelAmount >= 0) {
            const response = await fetch(urlBuyFuel, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fuelAmount }),
            });

            if (!response.ok) {
                throw new Error('Error buying fuel');
            }

            const result = await response.json();

            range += fuelAmount * 2;
            money -= fuelAmount;
            updateDisplay();
            showElement("game-destination");
        } else {
            alert("Please enter a valid non-negative number for fuel.");
        }
    }

    async function submitDestination(event) {
        event.preventDefault();
        const selectedDestination = destinationInput.value;
        let urlSubmitDestination = apiUrl + 'submit_destination';
        if (selectedDestination) {
            const response = await fetch(urlSubmitDestination, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedDestination }),
            });

            if (!response.ok) {
                throw new Error('Error submitting destination');
            }

            alert(`You have selected ${selectedDestination} as your destination.`);
            showElement("game-secret-box");
        } else {
            alert("Please enter a valid destination.");
        }
    }

    async function handleSecretBox(event) {
        const clickedButton = event.target.id;
        let urlHandleMoney = apiUrl + 'handle_money_button';
        let urlHandleRange = apiUrl + 'handle_range_button';
        let urlHandleSkip = apiUrl + 'handle_skip_button';
        if (clickedButton === "money") {
            const response = await fetch(urlHandleMoney, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Error handling money button');
            }

            // Handle the case when the player chooses 100 EUR
            // Replace this comment with your logic
            alert("Player chose 100 EUR. Implement your logic here.");
        } else if (clickedButton === "range") {
            const response = await fetch(urlHandleRange, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Error handling range button');
            }

            // Handle the case when the player chooses 50 km
            alert("Player chose 50 km. Implement your logic here.");
        } else if (clickedButton === "skip") {
            const response = await fetch(urlHandleSkip, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Error handling skip button');
            }

            // Handle the case when the player skips
            // Replace this comment with your logic
            alert("Player skipped. Implement your logic here.");
        }
    }

    async function restartGame() {
        let urlRestart = apiUrl + 'restart_game';
        const response = await fetch(urlRestart, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Error restarting game');
        }

        // Reset game variables and UI elements
        money = startMoney;
        range = startRange;
        currentAirportICAO = startAirportICAO;
        updateDisplay();
        showElement("intro");
    }

    function showElement(elementClass) {
        const elements = document.querySelectorAll('.game-resource-update, .game-destination, .game-secret-box, .game-win, .game-rules, .intro');
        elements.forEach(element => {
            element.classList.add('fadeOut');
        });

        const targetElement = document.querySelector(`.${elementClass}`);
        if (targetElement) {
            targetElement.classList.remove('fadeOut');
        }
    }

    function updateDisplay() {
        moneyDisplay.textContent = money.toFixed(0);
        rangeDisplay.textContent = range.toFixed(0);
    }

    showElement("intro");
});
