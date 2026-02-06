const friendName = "Sreshtha"; // CHANGE THIS

// DOM Elements
const introLayer = document.getElementById('intro-layer');
const giftBox = document.getElementById('gift-box-container');
const giftText = document.querySelector('.gift-text');
const mainContent = document.getElementById('main-party');
const ribbonBanner = document.querySelector('.ribbon-banner');
const nameSpan = document.getElementById('friendName');
const bgMusic = document.getElementById('bg-music'); // Audio Element

nameSpan.innerText = friendName.toUpperCase();

// Game State
let taps = 0;
const maxTaps = 5;

// --- 1. The Chase Logic ---
giftBox.addEventListener('click', (e) => {
    e.preventDefault(); 
    taps++;

    // Tap 1, 2, 3 -> Move Randomly
    if (taps < maxTaps - 1) {
        moveGift();
        changeGiftText();
        if (navigator.vibrate) navigator.vibrate(50);
    } 
    // Tap 4 -> Move to Center
    else if (taps === maxTaps - 1) {
        moveToCenter();
        giftText.innerText = "Open me! 🎁";
        if (navigator.vibrate) navigator.vibrate(50);
    }
    // Tap 5 -> The Grand Reveal
    else if (taps === maxTaps) {
        openGift();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    }
});

function moveGift() {
    giftBox.style.transform = 'none';
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const boxSize = 150; 
    const safeMaxX = Math.max(0, viewportWidth - boxSize);
    const safeMaxY = Math.max(0, viewportHeight - boxSize);
    const newX = Math.random() * safeMaxX;
    const newY = Math.random() * safeMaxY;

    giftBox.style.left = `${newX}px`;
    giftBox.style.top = `${newY}px`;
}

function moveToCenter() {
    giftBox.style.left = '50%';
    giftBox.style.top = '50%';
    giftBox.style.transform = 'translate(-50%, -50%)';
}

function changeGiftText() {
    const messages = ["Catch me!", "Nope, here!", "So slow! 😜", "Almost..."];
    if (taps <= messages.length) {
        giftText.innerText = messages[taps - 1];
    }
}

// --- 2. The Reveal Logic ---
function openGift() {
    // 1. Play Music
    if(bgMusic) {
        bgMusic.volume = 0.5; // Set start volume
        bgMusic.play().catch(error => {
            console.log("Auto-play prevented by browser, interaction required.");
        });
    }

    // 2. Hide gift
    giftBox.style.transform = 'scale(0)';
    giftBox.style.transition = 'transform 0.5s ease-in';

    // 3. Fade black screen
    setTimeout(() => {
        introLayer.style.opacity = '0';
    }, 500);
    
    // 4. Show Party
    setTimeout(() => {
        introLayer.style.display = 'none';
        document.body.classList.add('party-mode');
        
        mainContent.classList.remove('hidden');
        ribbonBanner.classList.remove('hidden');

        // Drop Ribbon
        setTimeout(() => {
             ribbonBanner.classList.add('drop-down');
        }, 100);

        // Pop Photos
        const polaroids = document.querySelectorAll('.polaroid');
        polaroids.forEach(p => p.classList.add('popped'));
        
        fireConfetti();
    }, 1500);
}

function fireConfetti() {
    // Use bright festive colors
    const colors = ['#FFD700', '#FF0080', '#00BFFF', '#ffffff'];

    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });

    // Continuous fountain for a few seconds
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}