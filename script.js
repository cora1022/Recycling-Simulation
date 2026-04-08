document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const inputs = {
        plastic: document.getElementById('plastic'),
        paper: document.getElementById('paper'),
        metal: document.getElementById('metal'),
        glass: document.getElementById('glass'),
        general: document.getElementById('general')
    };

    const targetRateInput = document.getElementById('target-rate');
    const targetValueText = document.getElementById('target-value');

    // Output elements
    const currentRateText = document.getElementById('current-rate');
    const progressBar = document.getElementById('progress-bar');
    const statusMessage = document.getElementById('status-message');
    const totalWasteText = document.getElementById('total-waste');
    const recyclableWasteText = document.getElementById('recyclable-waste');
    const targetDiffText = document.getElementById('target-diff');

    // Update target value text when slider moves
    targetRateInput.addEventListener('input', () => {
        targetValueText.textContent = `${targetRateInput.value}%`;
        calculateRate();
    });

    // Add event listeners to all waste inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateRate);
    });

    function calculateRate() {
        const plastic = parseFloat(inputs.plastic.value) || 0;
        const paper = parseFloat(inputs.paper.value) || 0;
        const metal = parseFloat(inputs.metal.value) || 0;
        const glass = parseFloat(inputs.glass.value) || 0;
        const general = parseFloat(inputs.general.value) || 0;
        const targetRate = parseFloat(targetRateInput.value) || 0;

        const recyclable = plastic + paper + metal + glass;
        const total = recyclable + general;
        const rate = total > 0 ? (recyclable / total) * 100 : 0;

        // Update UI
        updateUI(rate, total, recyclable, targetRate);
    }

    function updateUI(rate, total, recyclable, targetRate) {
        // Current Rate Display
        currentRateText.textContent = `${rate.toFixed(1)}%`;
        
        // Progress Bar
        progressBar.style.width = `${Math.min(rate, 100)}%`;
        
        // Color coding for progress bar
        if (rate < 50) {
            progressBar.style.backgroundColor = '#ff4d4d'; // Red
        } else if (rate < targetRate) {
            progressBar.style.backgroundColor = '#ffcc00'; // Yellow
        } else {
            progressBar.style.backgroundColor = '#4CAF50'; // Green
        }

        // Stats
        totalWasteText.textContent = `${total.toFixed(1)} kg`;
        recyclableWasteText.textContent = `${recyclable.toFixed(1)} kg`;

        // Target Difference
        const diff = targetRate - rate;
        if (total === 0) {
            targetDiffText.textContent = '-';
            statusMessage.textContent = '쓰레기 양을 입력하여 시뮬레이션을 시작하세요!';
        } else if (diff <= 0) {
            targetDiffText.textContent = '목표 달성!';
            targetDiffText.style.color = '#4CAF50';
            statusMessage.textContent = '축하합니다! 목표 재활용율을 달성했습니다! 🎉';
        } else {
            // How much more recyclable waste needed or how much general waste to reduce
            // Equation: (recyclable + x) / (total + x) = targetRate / 100
            // recyclable + x = (targetRate / 100) * total + (targetRate / 100) * x
            // x * (1 - targetRate/100) = (targetRate/100) * total - recyclable
            // x = ((targetRate/100) * total - recyclable) / (1 - targetRate/100)
            
            let message = '';
            if (targetRate < 100) {
                const targetFactor = targetRate / 100;
                const neededRecyclable = (targetFactor * total - recyclable) / (1 - targetFactor);
                
                if (neededRecyclable > 0) {
                    targetDiffText.textContent = `${neededRecyclable.toFixed(1)} kg 더 재활용 필요`;
                    message = `목표까지 ${diff.toFixed(1)}% 남았습니다. 분리배출에 더 힘써주세요!`;
                } else {
                    // This case shouldn't happen if diff > 0, but for safety:
                    targetDiffText.textContent = `${diff.toFixed(1)}% 부족`;
                }
            } else {
                targetDiffText.textContent = '일반 쓰레기 0kg 필요';
                message = '100% 목표를 위해서는 일반 쓰레기를 모두 없애야 합니다!';
            }
            targetDiffText.style.color = '#ff4d4d';
            statusMessage.textContent = message;
        }
    }

    // Initial calculation
    calculateRate();
});
