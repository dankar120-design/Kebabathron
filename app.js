document.addEventListener('DOMContentLoaded', () => {

    const state = {
        charStates: {
            1: 'idle', // idle, ja, nej
            2: 'idle',
            3: 'idle'
        }
    };

    const selectors = {
        1: document.getElementById('select-char-1'),
        2: document.getElementById('select-char-2'),
        3: document.getElementById('select-char-3')
    };

    const labels = {
        1: document.getElementById('status-1'),
        2: document.getElementById('status-2'),
        3: document.getElementById('status-3')
    };

    // Init
    Object.keys(selectors).forEach(id => {
        selectors[id].addEventListener('click', () => handleCharClick(id));
    });

    function handleCharClick(id) {
        const currentState = state.charStates[id];

        // Cycle: idle -> ja -> nej -> idle
        let nextState = 'idle';
        if (currentState === 'idle') nextState = 'ja';
        else if (currentState === 'ja') nextState = 'nej';
        else if (currentState === 'nej') nextState = 'idle';

        updateCharState(id, nextState);
    }

    function updateCharState(id, newState) {
        state.charStates[id] = newState;

        const selector = selectors[id];
        const label = labels[id];

        // Reset
        selector.classList.remove('selected-green', 'selected-red');
        label.innerText = '';

        if (newState === 'ja') {
            selector.classList.add('selected-green');
            label.innerText = 'Ja 🍕';
            label.style.color = 'var(--neon-green)';
        } else if (newState === 'nej') {
            selector.classList.add('selected-red');
            label.innerText = 'Nej 🌈';
            label.style.color = 'var(--neon-red)';
        }

        checkVictory();
    }

    function checkVictory() {
        const allJa = Object.values(state.charStates).every(s => s === 'ja');
        const overlay = document.getElementById('celebration-overlay');

        if (allJa) {
            overlay.classList.remove('hidden');
            startParticles();
        } else {
            overlay.classList.add('hidden');
            stopParticles();
        }
    }

    let particleInterval = null;
    function startParticles() {
        if (particleInterval) return;
        const container = document.getElementById('particles-container');
        const emojis = ['🍕', '🍟', '🥙', '🍺', '🔥', '✨'];

        particleInterval = setInterval(() => {
            const p = document.createElement('div');
            p.className = 'particle';
            p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-50px';
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            p.style.opacity = Math.random();
            container.appendChild(p);

            // Cleanup
            setTimeout(() => p.remove(), 4000);
        }, 150);
    }

    function stopParticles() {
        clearInterval(particleInterval);
        particleInterval = null;
        document.getElementById('particles-container').innerHTML = '';
    }

});
