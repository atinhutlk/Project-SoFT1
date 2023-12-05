document.addEventListener("DOMContentLoaded", function () {
    // Constants
    const startMoney = 1000;
    const startRange = 2000;
    let startAirportICAO = "LFPG"; // Replace with your starting airport's ICAO code

    // Initial game state
    let money = startMoney;
    let range = startRange;
    let currentAirportICAO = startAirportICAO;

    // Sample array of airports in range (replace this with your actual data)
    const airportsInRange = [
        { name: "Airport 1", icao: "ICAO1" },
        { name: "Airport 2", icao: "ICAO2" },
        // Add more airports as needed
    ];

    // HTML elements
    const moneyDisplay = document.querySelector(".money");
    const rangeDisplay = document.querySelector(".range");
    const playerNameInput = document.getElementById("screen-name");
    const startButton = document.getElementById("start-button");
    const buyButton = document.getElementById("buy-button");
    const airportsList = document.getElementById("airports-list");
    const destinationSelect = document.getElementById("icao-code");
    const submitDestinationButton = document.getElementById("submit-icao-button");

    // Event listeners
    startButton.addEventListener("click", startGame);
    buyButton.addEventListener("click", buyFuel);
    submitDestinationButton.addEventListener("click", submitDestination);

    // Functions
    function startGame(event) {
        event.preventDefault();
        const playerName = playerNameInput.value;
        if (playerName) {
            alert(`Welcome, ${playerName}! Your adventure begins at ${startAirportICAO}.`);
            showElement("game-resource-update");
            document.getElementById("startAirportICAO").textContent = startAirportICAO;
            showAirportsInRange();
        } else {
            alert("Please enter a player name.");
        }
    }

    function showAirportsInRange() {
        airportsList.innerHTML = ""; // Clear the existing list

        airportsInRange.forEach(airport => {
            const listItem = document.createElement("li");
            listItem.textContent = `${airport.name} (ICAO: ${airport.icao})`;
            airportsList.appendChild(listItem);

            // Add each airport to the destination select dropdown
            const option = document.createElement("option");
            option.value = airport.icao;
            option.textContent = `${airport.name} (ICAO: ${airport.icao})`;
            destinationSelect.appendChild(option);
        });
    }

    function buyFuel(event) {
        event.preventDefault();
        const fuelAmount = parseFloat(document.getElementById("resource-exchange").value);
        if (!isNaN(fuelAmount) && fuelAmount >= 0) {
            range += fuelAmount * 2;
            money -= fuelAmount;
            updateDisplay();
            showElement("game-destination");
        } else {
            alert("Please enter a valid non-negative number for fuel.");
        }
    }

    function submitDestination(event) {
        event.preventDefault();
        const selectedDestination = destinationSelect.value;
        if (selectedDestination) {
            // Perform logic for submitting the destination
            alert(`You have selected ${selectedDestination} as your destination.`);
            // Update game state or perform other actions as needed

            // Move to the next step
            showElement("game-secret-box");
        } else {
            alert("Please select a valid destination.");
        }
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
