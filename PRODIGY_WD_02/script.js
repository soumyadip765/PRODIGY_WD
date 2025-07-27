document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapsContainer = document.querySelector('.laps-container');
    
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let laps = [];
    
    function formatTime(ms) {
        let date = new Date(ms);
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    function updateDisplay() {
        display.textContent = formatTime(elapsedTime);
    }
    
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 10);
            isRunning = true;
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            lapBtn.disabled = false;
            resetBtn.disabled = false;
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        updateDisplay();
        laps = [];
        renderLaps();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
    }
    
    function recordLap() {
        if (isRunning) {
            const lapTime = elapsedTime;
            const previousLapTime = laps.length > 0 ? lapTime - laps[laps.length - 1].totalTime : lapTime;
            
            laps.push({
                lapNumber: laps.length + 1,
                lapTime: previousLapTime,
                totalTime: lapTime
            });
            
            renderLaps();
        }
    }
    
    function renderLaps() {
        if (laps.length === 0) {
            lapsContainer.innerHTML = '<div class="no-laps">No laps recorded yet</div>';
            return;
        }
        let fastestLap = Infinity;
        let slowestLap = -Infinity;
        
        laps.forEach(lap => {
            if (lap.lapTime < fastestLap) fastestLap = lap.lapTime;
            if (lap.lapTime > slowestLap) slowestLap = lap.lapTime;
        });
        
        let lapsHTML = laps.map(lap => {
            let lapClass = '';
            if (laps.length > 1) {
                if (lap.lapTime === fastestLap) lapClass = 'fastest';
                else if (lap.lapTime === slowestLap) lapClass = 'slowest';
            }
            
            return `
                <div class="lap-item ${lapClass}">
                    <span class="lap-number">Lap ${lap.lapNumber}</span>
                    <span class="lap-time">${formatTime(lap.lapTime)}</span>
                </div>
            `;
        }).reverse().join('');
        
        lapsContainer.innerHTML = lapsHTML;
    }
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
    updateDisplay();
});