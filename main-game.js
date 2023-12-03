
const game = () => {
    const startButton = document.getElementById('start-button');
    const buyButton = document.getElementById('buy-button');
    const icaoSubmission = document.getElementById('submit-icao-button');
    const secretboxOptions = document.querySelectorAll('.game-secret-box button');
    // Check for option value: option in options => option.textContent
    const restartButton = document.getElementById('restart');

    const changeScreen = (clickedButton, closingScreenClass, openingScreenClass) => {
        let closingScreen = document.querySelector(`.${closingScreenClass}`);
        let openingScreen = document.querySelector(`.${openingScreenClass}`);
        clickedButton.addEventListener('click', (event) => {
            event.preventDefault();
            closingScreen.classList.add('fadeOut');
            openingScreen.classList.add('fadeIn');
        });
    }
    changeScreen(startButton, 'intro', 'game-resource-update');
    
    changeScreen();
};

game();