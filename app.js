import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOoqE6xdLwtvsYFmIiviTx9CBkhZiNYCI",
    authDomain: "kebabathron.firebaseapp.com",
    projectId: "kebabathron",
    storageBucket: "kebabathron.firebasestorage.app",
    messagingSenderId: "137494300200",
    appId: "1:137494300200:web:b0a838442acde0a699971d",
    databaseURL: "https://kebabathron-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const stateRef = ref(db, 'invitation/chars');

document.addEventListener('DOMContentLoaded', () => {

    const state = {
        charStates: {
            1: 'idle',
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

    // Listen for changes in Firebase (Real-time Sync)
    onValue(stateRef, (snapshot) => {
        console.log("Firebase connection established, data received:", snapshot.val());
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(id => {
                updateUI(id, data[id]);
                state.charStates[id] = data[id];
            });
            checkVictory();
        }
    }, (error) => {
        console.error("Firebase read error:", error);
        alert("Kunde inte läsa från databasen. Kontrollera säkerhetsregler.");
    });

    // Event Listeners
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

        console.log(`Attempting to set char ${id} to ${nextState}`);
        // Update Firebase (Cloud update)
        set(ref(db, `invitation/chars/${id}`), nextState)
            .then(() => console.log("Success!"))
            .catch((error) => {
                console.error("Firebase write error:", error);
                alert("Kunde inte spara valet: " + error.message);
            });
    }

    function updateUI(id, newState) {
        const selector = selectors[id];
        const label = labels[id];

        if (!selector || !label) return;

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
        if (document.getElementById('particles-container')) {
            document.getElementById('particles-container').innerHTML = '';
        }
    }

});
