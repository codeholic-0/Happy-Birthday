const friendName = "Emily"; // CHANGE THIS!

// DOM Elements
const nameSpan = document.getElementById('friendName');
nameSpan.innerText = friendName.toUpperCase();

const introLayer = document.getElementById('intro-layer');
const giftBox = document.getElementById('gift-box-container');
const giftText = document.querySelector('.gift-text');
const bgMusic = document.getElementById('bg-music');
const twilightBg = document.querySelector('.twilight-background');

const constellationLayer = document.getElementById('constellation-layer');
const climaxLayer = document.getElementById('climax-layer');
const starNodes = document.querySelectorAll('.star-node');
const svgCanvas = document.getElementById('constellation-lines');
const surpriseBanner = document.querySelector('.surprise-banner');
const instructionText = document.querySelector('.instruction-text');

// --- 0. Stardust Particle Engine (Star Shapes & Scatter) ---
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx; let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function createParticle(x, y) {
    const scatterX = x + (Math.random() * 40 - 20);
    const scatterY = y + (Math.random() * 40 - 20);

    particles.push({ 
        x: scatterX, y: scatterY, 
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
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        drawStar(0, 0, 5, p.size, p.size / 2); 
        ctx.restore();

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
        const baseAngle = (i - 1) * (Math.PI / 3); 
        const randomOffset = (Math.random() - 0.5) * (Math.PI / 4); 
        const angle = baseAngle + randomOffset;
        
        const dist = 25 + Math.random() * 13; 
        const left = 50 + (dist * Math.cos(angle));
        const top = 50 + (dist * Math.sin(angle) * 1.2); 
        
        node.style.left = `${Math.max(10, Math.min(90, left))}%`;
        node.style.top = `${Math.max(10, Math.min(90, top))}%`;
    }
}
randomizeStarNodes(); 

// --- 2. Box Chase Logic ---
let taps = 0;
const maxTaps = 5;

giftBox.addEventListener('click', (e) => {
    e.preventDefault(); taps++;
    if (taps < maxTaps - 1) {
        moveGift(); changeGiftText();
        if (navigator.vibrate) navigator.vibrate(50);
    } 
    else if (taps === maxTaps - 1) {
        moveToCenter(); giftText.innerText = "Open me! 🎁";
        if (navigator.vibrate) navigator.vibrate(50);
    }
    else if (taps === maxTaps) {
        startConstellationPhase();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    }
});

function moveGift() {
    giftBox.style.transform = 'none';
    const boxSize = 150; 
    const safeMaxX = Math.max(0, window.innerWidth - boxSize);
    const safeMaxY = Math.max(0, window.innerHeight - boxSize);
    giftBox.style.left = `${Math.random() * safeMaxX}px`;
    giftBox.style.top = `${Math.random() * safeMaxY}px`;
}
function moveToCenter() { giftBox.style.left = '50%'; giftBox.style.top = '50%'; giftBox.style.transform = 'translate(-50%, -50%)'; }
function changeGiftText() { const messages = ["Catch me!", "Nope, here!", "So slow! 😜", "Almost..."]; giftText.innerText = messages[taps - 1] || ""; }

// --- 3. Constellation Phase ---
let unlockedCount = 0;
let linesData = [];

const nodeConnections = [
    [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], 
    [1,2], [2,3], [3,4], [4,5], [5,6], [6,1]  
];

function startConstellationPhase() {
    if(bgMusic) { bgMusic.volume = 0.2; bgMusic.play().catch(e => console.log("Audio needed")); }

    giftBox.style.transform = 'scale(0)';
    setTimeout(() => { introLayer.style.opacity = '0'; }, 300);
    
    twilightBg.classList.add('deep-space');

    setTimeout(() => {
        introLayer.style.display = 'none';
        constellationLayer.classList.remove('hidden');
        drawConstellationLines(); 
    }, 1500);
}

function drawConstellationLines() {
    svgCanvas.innerHTML = ''; linesData = [];
    nodeConnections.forEach(pair => {
        const nodeA = document.querySelector(`.star-node[data-index="${pair[0]}"]`);
        const nodeB = document.querySelector(`.star-node[data-index="${pair[1]}"]`);
        const rect1 = nodeA.getBoundingClientRect();
        const rect2 = nodeB.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width/2; const y1 = rect1.top + rect1.height/2;
        const x2 = rect2.left + rect2.width/2; const y2 = rect2.top + rect2.height/2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.classList.add('constellation-line');
        
        svgCanvas.appendChild(line);
        linesData.push({ element: line, nodeA: pair[0], nodeB: pair[1] });
    });
}

starNodes.forEach(node => {
    node.addEventListener('click', () => {
        if(node.classList.contains('unlocked')) return; 
        
        starNodes.forEach(n => n.style.zIndex = '10');
        node.style.zIndex = '100';

        node.classList.add('unlocked');
        createParticleBurst(node.getBoundingClientRect());
        unlockedCount++;

        linesData.forEach(lineObj => {
            const nodeA_unlocked = document.querySelector(`.star-node[data-index="${lineObj.nodeA}"]`).classList.contains('unlocked');
            const nodeB_unlocked = document.querySelector(`.star-node[data-index="${lineObj.nodeB}"]`).classList.contains('unlocked');
            if (nodeA_unlocked && nodeB_unlocked) { lineObj.element.classList.add('drawn'); }
        });

        // Boss Star Reveal
        if (unlockedCount === 6) {
            setTimeout(() => {
                const centerStar = document.querySelector('.star-node[data-index="0"]');
                centerStar.classList.remove('hidden-core');
                centerStar.classList.add('reveal-core');
                
                instructionText.innerText = "The core is ready...";
                createParticleBurst(centerStar.getBoundingClientRect());
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
            }, 1000); 
        }

        // Grand Climax
        if(unlockedCount === starNodes.length) {
            instructionText.style.opacity = '0';
            setTimeout(triggerGrandClimax, 3000); 
        }
    });
});

function createParticleBurst(rect) {
    for(let i=0; i<40; i++) { createParticle(rect.left + rect.width/2, rect.top + rect.height/2); }
}

// --- 4. Grand Climax ---
function triggerGrandClimax() {
    if(bgMusic) {
        let vol = 0.2;
        let fade = setInterval(() => {
            vol += 0.05;
            if(vol >= 1) { clearInterval(fade); vol = 1; }
            bgMusic.volume = vol;
        }, 150);
    }

    constellationLayer.style.opacity = '0';
    setTimeout(() => {
        constellationLayer.style.display = 'none';
        climaxLayer.classList.remove('hidden');
        
        surpriseBanner.classList.remove('hidden');
        setTimeout(() => surpriseBanner.classList.add('drop'), 100);

        fireMassiveConfetti();
    }, 1500);
}

function fireMassiveConfetti() {
    const duration = 5000; const end = Date.now() + duration;
    const colors = ['#FFD700', '#FF00de', '#00BFFF', '#ffffff'];
    (function frame() {
        confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors });
        confetti({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}