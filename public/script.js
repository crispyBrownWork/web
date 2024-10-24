class RouletteGame {
    constructor() {
        this.wheel = document.querySelector('.wheel');
        this.spinButton = document.getElementById('spin');
        this.placeBetButton = document.getElementById('placeBet');
        this.betAmount = document.getElementById('betAmount');
        this.betType = document.getElementById('betType');
        this.balanceElement = document.getElementById('balance');
        this.currentBetElement = document.getElementById('currentBet');
        this.lastResultElement = document.getElementById('lastResult');
        this.winStreakElement = document.getElementById('winStreak');
        this.streakMultiplierElement = document.getElementById('streakMultiplier');
        
        this.balance = 1000;
        this.currentBet = 0;
        this.currentBetType = '';
        this.isSpinning = false;
        this.winStreak = 0;
        
        this.setupEventListeners();
        this.spinButton.disabled = true;
    }

    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.placeBetButton.addEventListener('click', () => this.placeBet());
    }

    createConfetti() {
        const container = document.createElement('div');
        container.className = 'winning-animation';
        document.body.appendChild(container);

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.backgroundColor = ['#ff0', '#f0f', '#0ff', '#0f0'][Math.floor(Math.random() * 4)];
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    }

    showWinMessage(amount) {
        const message = document.createElement('div');
        message.className = 'win-message';
        message.textContent = `🎉 You won $${amount}! 🎉`;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    placeBet() {
        const amount = parseInt(this.betAmount.value);
        const type = this.betType.value;

        if (amount > this.balance) {
            alert('Insufficient funds!');
            return;
        }

        this.currentBet = amount;
        this.currentBetType = type;
        this.balance -= amount;
        this.updateUI();
        this.spinButton.disabled = false;
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.placeBetButton.disabled = true;

        const rotations = 5 + Math.random() * 5;
        const degrees = rotations * 360 + this.getRandomDegree();
        
        this.wheel.style.transform = `rotate(${degrees}deg)`;

        setTimeout(() => {
            this.determineWinner(degrees % 360);
            this.isSpinning = false;
            this.spinButton.disabled = true;
            this.placeBetButton.disabled = false;
        }, 5000);
    }

    getRandomDegree() {
        return Math.floor(Math.random() * 36) * 10;
    }

    determineWinner(finalDegree) {
        const normalizedDegree = (360 - finalDegree) % 360;
        const position = Math.floor(normalizedDegree / 10);
        
        let result;
        if (position === 0) {
            result = 'green';
        } else {
            result = position % 2 === 0 ? 'red' : 'black';
        }

        this.lastResultElement.textContent = result;
        this.wheel.classList.remove('winner');

        const isWinner = result === this.currentBetType;

        if (isWinner) {
            this.winStreak++;
            const streakMultiplier = Math.min(1 + (this.winStreak * 0.2), 3);
            
            const baseWinnings = this.currentBetType === 'green' ? 
                this.currentBet * 35 : 
                this.currentBet * 2;
            
            const totalWinnings = Math.floor(baseWinnings * streakMultiplier);
            
            this.balance += totalWinnings;
            this.wheel.classList.add('winner');
            this.createConfetti();
            this.showWinMessage(totalWinnings);
        } else {
            this.winStreak = 0;
        }

        this.currentBet = 0;
        this.currentBetType = '';
        this.updateUI();
    }

    updateUI() {
        this.balanceElement.textContent = this.balance;
        this.currentBetElement.textContent = this.currentBet;
        this.winStreakElement.textContent = this.winStreak;
        this.streakMultiplierElement.textContent = `x${(1 + (this.winStreak * 0.2)).toFixed(1)}`;
        this.spinButton.disabled = this.currentBet === 0;
    }
}

// Wait for DOM to be fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new RouletteGame();
});
