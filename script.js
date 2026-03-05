const friendName = "Emily"; // CHANGE THIS!

// DOM Elements
const nameSpan = document.getElementById('friendName');
nameSpan.innerText = friendName.toUpperCase();

const introLayer = document.getElementById('intro-layer');
const giftBox = document.getElementById('gift-box-container');
const giftText = document.querySelector('.gift-text');
const bgMusic = document.getElementById('bg-music');

// Background Layers
const bgTwilight = document.getElementById('bg-twilight');
const bgSunflower = document.getElementById('bg-sunflower');

const constellationLayer = document.getElementById('constellation-layer');
const climaxLayer = document.getElementById('climax-layer');
const starNodes = document.querySelectorAll('.star-node');
const svgCanvas = document.getElementById('constellation-lines');
const surpriseBanner = document.querySelector('.surprise-banner');
const instructionText = document.querySelector('.instruction-text');

// Overlay Elements
const photoOverlay = document.getElementById('photo-overlay');
const overlayImg = document.getElementById('overlay-img');
const overlayCaption = document.getElementById('overlay-caption');

// --- 0. Stardust Particle Engine ---
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3; let x = cx; let y = cy; let step = Math.PI / spikes;
    ctx.beginPath(); ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius; ctx.lineTo(x, y); rot += step;
        x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius; ctx.lineTo(x, y); rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius); ctx.closePath(); ctx.fill();
}

function createParticle(x, y) {
    particles.push({ 
        x: x + (Math.random() * 40 - 20), y: y + (Math.random() * 40 - 20), 
        size: Math.random() * 3 + 2, 
        speedX: Math.random() * 1 - 0.5, speedY: Math.random() * 1 - 0.5, 
        life: 1, rotation: Math.random() * Math.PI * 2 
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.speedX; p.y += p.speedY; p.life -= 0.02; p.rotation += 0.05;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.life})`;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
        drawStar(0, 0, 5, p.size, p.size / 2); ctx.restore();
        if (p.life <= 0) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('mousemove', (e) => createParticle(e.x, e.y));
window.addEventListener('touchmove', (e) => createParticle(e.touches[0].clientX, e.touches[0].clientY));
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; drawConstellationLines();});

// --- 1. Randomize Outer Constellation Map ---
function randomizeStarNodes() {
    for(let i = 1; i <= 6; i++) {
        const node = document.querySelector(`.star-node[data-index="${i}"]`);
        const angle = ((i - 1) * (Math.PI / 3)) + ((Math.random() - 0.5) * (Math.PI / 4)); 
        const dist = 25 + Math.random() * 13; 
        const left = 50 + (dist * Math.cos(angle));
        const top = 50 + (dist * Math.sin(angle) * 1.2); 
        node.style.left = `${Math.max(10, Math.min(90, left))}%`;
        node.style.top = `${Math.max(10, Math.min(90, top))}%`;
    }
}
randomizeStarNodes(); 

// --- 2. Box Chase Logic ---
let taps = 0; const maxTaps = 5;

giftBox.addEventListener('click', (e) => {
    e.preventDefault(); taps++;
    if (taps < maxTaps - 1) {
        giftBox.style.transform = 'none';
        giftBox.style.left = `${Math.random() * Math.max(0, window.innerWidth - 150)}px`;
        giftBox.style.top = `${Math.random() * Math.max(0, window.innerHeight - 150)}px`;
        giftText.innerText = ["Catch me!", "Nope, here!", "So slow! 😜", "Almost..."][taps - 1] || "";
        if (navigator.vibrate) navigator.vibrate(50);
    } 
    else if (taps === maxTaps - 1) {
        giftBox.style.left = '50%'; giftBox.style.top = '50%'; giftBox.style.transform = 'translate(-50%, -50%)';
        giftText.innerText = "Open me! 🎁";
        if (navigator.vibrate) navigator.vibrate(50);
    }
    else if (taps === maxTaps) {
        startConstellationPhase();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    }
});

// --- 3. Constellation Phase & Tap-to-Dismiss Logic ---
let unlockedCount = 0;
let linesData = [];
let currentViewingNode = null; 
const nodeConnections = [[0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1]];

function startConstellationPhase() {
    if(bgMusic) { bgMusic.volume = 0.2; bgMusic.play().catch(e => console.log("Audio needed")); }
    giftBox.style.transform = 'scale(0)';
    
    // Fade in the purple twilight layer over the sunset
    bgTwilight.style.opacity = '1';

    setTimeout(() => { 
        introLayer.style.opacity = '0'; 
        setTimeout(() => {
            introLayer.style.display = 'none';
            constellationLayer.classList.remove('hidden');
            drawConstellationLines(); 
        }, 800);
    }, 300);
}

function drawConstellationLines() {
    svgCanvas.innerHTML = ''; linesData = [];
    nodeConnections.forEach(pair => {
        const rect1 = document.querySelector(`.star-node[data-index="${pair[0]}"]`).getBoundingClientRect();
        const rect2 = document.querySelector(`.star-node[data-index="${pair[1]}"]`).getBoundingClientRect();
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', rect1.left + rect1.width/2); line.setAttribute('y1', rect1.top + rect1.height/2);
        line.setAttribute('x2', rect2.left + rect2.width/2); line.setAttribute('y2', rect2.top + rect2.height/2);
        line.classList.add('constellation-line');
        svgCanvas.appendChild(line);
        linesData.push({ element: line, nodeA: pair[0], nodeB: pair[1] });
    });
}

// Open the Photo
starNodes.forEach(node => {
    node.addEventListener('click', () => {
        if(node.classList.contains('unlocked') || currentViewingNode) return; 
        
        currentViewingNode = node; 
        overlayImg.src = node.querySelector('img').src;
        overlayCaption.innerText = node.querySelector('.caption').innerText;
        photoOverlay.classList.add('active');
    });
});

// Close the Photo
photoOverlay.addEventListener('click', () => {
    if (!currentViewingNode) return;

    photoOverlay.classList.remove('active');
    const node = currentViewingNode;
    currentViewingNode = null; 

    node.classList.add('unlocked');
    
    const rect = node.getBoundingClientRect();
    for(let i=0; i<40; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
    
    unlockedCount++;

    linesData.forEach(lineObj => {
        const nodeA = document.querySelector(`.star-node[data-index="${lineObj.nodeA}"]`);
        const nodeB = document.querySelector(`.star-node[data-index="${lineObj.nodeB}"]`);
        if (nodeA.classList.contains('unlocked') && nodeB.classList.contains('unlocked')) { 
            lineObj.element.classList.add('drawn'); 
        }
    });

    if (unlockedCount === 6) {
        setTimeout(() => {
            const centerStar = document.querySelector('.star-node[data-index="0"]');
            centerStar.classList.remove('hidden-core');
            centerStar.classList.add('reveal-core');
            instructionText.innerText = "The core is ready...";
            const cRect = centerStar.getBoundingClientRect();
            for(let i=0; i<40; i++) createParticle(cRect.left + cRect.width/2, cRect.top + cRect.height/2);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        }, 1000); 
    }

    // SNAP TO CLIMAX: Reduced from 2000ms to 200ms
    if(unlockedCount === starNodes.length) {
        instructionText.style.opacity = '0';
        setTimeout(triggerGrandClimax, 200); 
    }
});

// --- 4. Grand Climax ---
function triggerGrandClimax() {
    if(bgMusic) {
        let vol = 0.2;
        let fade = setInterval(() => { vol += 0.05; if(vol >= 1) { clearInterval(fade); vol = 1; } bgMusic.volume = vol; }, 150);
    }
    
    // Fade out map rapidly
    constellationLayer.style.opacity = '0';
    
    // Bloom the Bright Golden Sunflower Background instantly!
    bgSunflower.style.opacity = '1';

    // Bring in finale instantly instead of waiting
    setTimeout(() => {
        constellationLayer.style.display = 'none';
        climaxLayer.classList.remove('hidden');
        surpriseBanner.classList.remove('hidden');
        setTimeout(() => surpriseBanner.classList.add('drop'), 100);
        fireMassiveConfetti();
    }, 400); // Super fast transition
}

function fireMassiveConfetti() {
    const end = Date.now() + 1500; 
    const colors = ['#FFD700', '#FF8C00', '#FF00de', '#ffffff']; // Added orange for sunflower theme
    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors, zIndex: 9999 });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors, zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}