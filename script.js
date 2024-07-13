let pumpButton = document.getElementById('pump-button');
let collectButton = document.getElementById('collect-button');
let earningsDisplay = document.getElementById('earnings');
let balloonCountDisplay = document.getElementById('balloon-count');
let rewardOfPumpDisplay = document.getElementById('reward-of-pump');
let canvas = document.getElementById('reward-chart');
let ctx = canvas.getContext('2d');
let earnings = 0;
let balloonSize = 100; // Initial size of the balloon
let burstLimit = getRandomBurstLimit(); // Initial burst limit
let balloonColor = 'red'; // Initial color of the balloon
let totalBalloons = 3 ; // Total number of balloons in the test
let currentBalloon = 1 ; // Current balloon number
let rewards = [] ; // Array to store rewards for each balloon
let pumps = 0 ; // Number of pumps for the current balloon
let reward=0 ;  // the reward of collecting the current balloon

const pumpSound = new Audio('pump-sound.mp3'); 
const burstSound = new Audio('burst-sound.mp3');
const collectSound = new Audio('collect-sound.mp3'); 
const endgamesound = new Audio ('endgame_sound.mp3');
// Initialize Chart.js
let rewardChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Balloon numbers
        datasets: [{
            label: 'Reward',
            data: [], // Rewards
            borderColor: 'blue',
            borderWidth: 3,
            fill: true,
            lineTension: 0
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Balloon Number'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Reward'
                }
            }
        }
    }
});

function getRandomBurstLimit() {
    return Math.floor(Math.random() * 15) + 5; // Random burst limit between 5 and 20 pumps
}

function updateBalloon() {
    balloon.style.width = balloonSize + 'px';
    balloon.style.height = balloonSize + 'px';
    balloon.style.backgroundColor = balloonColor;
}

function resetBalloon() {
    if (currentBalloon == totalBalloons) {
        endgamesound.play() ;
        alert('Test complete! Total earnings: $' + earnings.toFixed(2));
        pumpButton.disabled=true
        collectButton.disabled=true
        return ;
    }

    balloonSize = 100;
    pumps = 0;
    balloonColor = balloonColor === 'red' ? 'blue' : 'red'; // Alternate balloon color
    burstLimit = getRandomBurstLimit(); // New random burst limit
    currentBalloon++;
    updateBalloon();
    updateBalloonCount();
    updateRewardOfPump();
    drawRewardChart();
}

function updateBalloonCount() {
    balloonCountDisplay.textContent = `Balloon: ${currentBalloon} / ${totalBalloons}`;
}

function updateRewardOfPump() {
    let rewardofpumps = Math.pow(2, pumps);
    rewardOfPumpDisplay.textContent = `Reward of Pump: $${rewardofpumps.toFixed(2)}`;
}

function drawRewardChart() {
    rewardChart.data.labels = Array.from({ length: rewards.length }, (_, i) => i + 1);
    rewardChart.data.datasets[0].data = rewards;
    rewardChart.update();
}

pumpButton.addEventListener('click', () => {
    pumps++;
    pumpSound.play() ;
    reward += Math.pow(2, pumps - 1);
    balloonSize += 10;
    updateBalloon();
    updateRewardOfPump();

    if (pumps >= burstLimit) {
        burstSound.play();
        alert('Balloon burst!');
        rewards.push(0); // No reward for burst balloon
        resetBalloon();
    }
});

collectButton.addEventListener('click', () => {
    collectSound.play()
    if (pumps < burstLimit) {
        earnings += reward; // Adding the reward
        rewards.push(reward);
        reward=0
        earningsDisplay.textContent = `Earnings: $${earnings.toFixed(2)}`;
    } else {
        rewards.push(0);
    }
    resetBalloon();
});

updateBalloon(); // Initial balloon setup
updateBalloonCount(); // Initial balloon count setup
updateRewardOfPump(); // Initial reward of pump setup