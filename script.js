const friendName = "Emily"; // CHANGE THIS!

const nameSpan = document.getElementById('friendName');
nameSpan.innerText = friendName.toUpperCase();

const introLayer = document.getElementById('intro-layer');
const giftBox = document.getElementById('gift-box-container');
const giftText = document.querySelector('.gift-text');
const bgMusic = document.getElementById('bg-music');

const bgTwilight = document.getElementById('bg-twilight');
const bgClimaxDark = document.getElementById('bg-climax-dark');

const constellationLayer = document.getElementById('constellation-layer');
const dialogueLayer = document.getElementById('dialogue-layer');
const climaxLayer = document.getElementById('climax-layer');

const starNodes = document.querySelectorAll('.star-node');
const svgCanvas = document.getElementById('constellation-lines');
const partyBanner = document.getElementById('party-banner');
const instructionText = document.querySelector('.instruction-text');
const dialogueText = document.getElementById('dialogue-text');

const photoOverlay = document.getElementById('photo-overlay');
const overlayImg = document.getElementById('overlay-img');
const overlayCaption = document.getElementById('overlay-caption');

// --- 0. Stardust Canvas ---
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

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
function createParticle(x, y) { particles.push({ x: x + (Math.random() * 40 - 20), y: y + (Math.random() * 40 - 20), size: Math.random() * 3 + 2, speedX: Math.random() * 1 - 0.5, speedY: Math.random() * 1 - 0.5, life: 1, rotation: Math.random() * Math.PI * 2 }); }
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.speedX; p.y += p.speedY; p.life -= 0.02; p.rotation += 0.05;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.life})`;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); drawStar(0, 0, 5, p.size, p.size / 2); ctx.restore();
        if (p.life <= 0) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Throttled particle generation to prevent browser lag
let lastParticleTime = 0;
function handleTrail(x, y) {
    if (Date.now() - lastParticleTime > 50) { 
        createParticle(x, y);
        lastParticleTime = Date.now();
    }
}
window.addEventListener('mousemove', (e) => handleTrail(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => handleTrail(e.touches[0].clientX, e.touches[0].clientY));


// --- 1. Geometric Star Formation (Perfect Circle Logic) ---
function setupStarFormation() {
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const radius = minDim * 0.32; 
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.55; 

    for(let i = 1; i <= 5; i++) {
        const node = document.querySelector(`.star-node[data-index="${i}"]`);
        const angle = -Math.PI / 2 + ((i - 1) * (2 * Math.PI / 5));
        
        const leftPx = cx + (radius * Math.cos(angle));
        const topPx = cy + (radius * Math.sin(angle));
        
        node.style.left = `${(leftPx / window.innerWidth) * 100}%`;
        node.style.top = `${(topPx / window.innerHeight) * 100}%`;
    }
}
setupStarFormation(); 

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    setupStarFormation();
    if (!constellationLayer.classList.contains('hidden') && linesData.length > 0) {
        drawConstellationLines();
    }
});

// --- 2. Box Chase Logic (Corners Focus) ---
let taps = 0; const maxTaps = 5;
let introStarted = false; // Safety lock against double-tapping

giftBox.addEventListener('click', (e) => {
    e.preventDefault(); 
    if (introStarted) return; 
    
    taps++;
    
    if (taps < maxTaps - 1) {
        // Define corners with padding
        const padding = 80;
        const boxWidth = 100;
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        const corners = [
            { x: padding, y: padding }, 
            { x: w - padding - boxWidth, y: padding }, 
            { x: padding, y: h - padding - boxWidth }, 
            { x: w - padding - boxWidth, y: h - padding - boxWidth } 
        ];

        let corner = corners[Math.floor(Math.random() * corners.length)];

        giftBox.style.left = `${corner.x}px`; 
        giftBox.style.top = `${corner.y}px`;
        // Explicitly maintain the transform so the coordinate math isn't thrown off
        giftBox.style.transform = 'translate(-50%, -50%)'; 
        
        giftText.innerText = ["Catch me!", "Nope, here!", "So slow! 😜", "Almost..."][taps - 1] || "";
        if (navigator.vibrate) navigator.vibrate(50);
    } 
    else if (taps === maxTaps - 1) {
        giftBox.style.left = '50%'; 
        giftBox.style.top = '50%'; 
        giftBox.style.transform = 'translate(-50%, -50%)';
        giftText.innerText = "Open me! 🎁";
    }
    else if (taps >= maxTaps) { 
        introStarted = true; 
        playIntroDialogue(); 
    }
});

// --- 3. The Intro Transition ---
function playIntroDialogue() {
    if(bgMusic) { bgMusic.volume = 0.2; bgMusic.play().catch(e=>console.log("Audio skipped")); }
    
    giftBox.style.transform = 'translate(-50%, -50%) scale(0)'; 
    bgTwilight.style.opacity = '1'; 
    
    setTimeout(() => {
        introLayer.style.opacity = '0';
        setTimeout(() => {
            introLayer.style.display = 'none';
            dialogueLayer.style.display = 'flex';
            dialogueLayer.classList.remove('hidden'); 
            dialogueLayer.style.opacity = '1';
            
            dialogueText.innerText = "Let's look at the stars...";
            dialogueText.classList.add('show');
            
            setTimeout(() => {
                dialogueText.classList.remove('show');
                setTimeout(() => {
                    dialogueLayer.style.opacity = '0';
                    setTimeout(() => {
                        dialogueLayer.style.display = 'none';
                        startConstellationPhase();
                    }, 800);
                }, 600);
            }, 2500);
        }, 800);
    }, 300);
}

// --- 4. Constellation Phase ---
let unlockedCount = 0; let linesData = []; let currentViewingNode = null; 
const nodeConnections = [[1,3], [3,5], [5,2], [2,4], [4,1]];

function startConstellationPhase() {
    constellationLayer.classList.remove('hidden'); 
    drawConstellationLines();
}

function drawConstellationLines() {
    svgCanvas.innerHTML = ''; linesData = [];
    nodeConnections.forEach(pair => {
        const nodeA = document.querySelector(`.star-node[data-index="${pair[0]}"]`);
        const nodeB = document.querySelector(`.star-node[data-index="${pair[1]}"]`);
        const rect1 = nodeA.getBoundingClientRect();
        const rect2 = nodeB.getBoundingClientRect();
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', rect1.left + rect1.width/2); line.setAttribute('y1', rect1.top + rect1.height/2);
        line.setAttribute('x2', rect2.left + rect2.width/2); line.setAttribute('y2', rect2.top + rect2.height/2);
        line.classList.add('constellation-line'); 
        
        if (nodeA.classList.contains('unlocked') && nodeB.classList.contains('unlocked')) { 
            line.classList.add('drawn'); 
        }
        
        svgCanvas.appendChild(line);
        linesData.push({ element: line, nodeA: pair[0], nodeB: pair[1] });
    });
}

starNodes.forEach(node => {
    node.addEventListener('click', () => {
        if(node.classList.contains('unlocked') || currentViewingNode) return; 
        currentViewingNode = node; overlayImg.src = node.querySelector('img').src;
        overlayCaption.innerText = node.querySelector('.caption').innerText; photoOverlay.classList.add('active');
    });
});

photoOverlay.addEventListener('click', () => {
    if (!currentViewingNode) return;
    photoOverlay.classList.remove('active'); const node = currentViewingNode; currentViewingNode = null; 
    node.classList.add('unlocked');
    const rect = node.getBoundingClientRect(); for(let i=0; i<40; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
    unlockedCount++;

    linesData.forEach(lineObj => {
        if (document.querySelector(`.star-node[data-index="${lineObj.nodeA}"]`).classList.contains('unlocked') && 
            document.querySelector(`.star-node[data-index="${lineObj.nodeB}"]`).classList.contains('unlocked')) { 
            lineObj.element.classList.add('drawn'); 
        }
    });

    if (unlockedCount === 5) {
        setTimeout(() => {
            const cStar = document.querySelector('.star-node[data-index="0"]');
            cStar.classList.remove('hidden-core'); cStar.classList.add('reveal-core');
            instructionText.innerText = "The core is ready...";
            const cRect = cStar.getBoundingClientRect(); for(let i=0; i<40; i++) createParticle(cRect.left + cRect.width/2, cRect.top + cRect.height/2);
        }, 1000); 
    }
    
    if(unlockedCount === 6) { 
        instructionText.style.opacity = '0'; 
        
        setTimeout(() => {
            constellationLayer.classList.add('revert-to-stars');
            setTimeout(playDialogue, 2000); 
        }, 1000); 
    }
});

// --- 5. Dialogue Transition ---
const messages = [
    "From all the stars in the sky...",
    "And all the memories we've made...",
    "There is only one thing left to say."
];

function playDialogue() {
    constellationLayer.style.transition = 'opacity 2s ease-in-out';
    constellationLayer.style.opacity = '0';
    
    setTimeout(() => {
        constellationLayer.style.display = 'none';
        
        dialogueLayer.style.display = 'flex'; 
        dialogueLayer.classList.remove('hidden'); 
        dialogueLayer.style.opacity = '1';
        
        let i = 0;
        function showNextMessage() {
            if (i < messages.length) {
                dialogueText.innerText = messages[i]; 
                dialogueText.classList.add('show');
                setTimeout(() => {
                    dialogueText.classList.remove('show'); 
                    i++;
                    setTimeout(showNextMessage, 800); 
                }, 2500); 
            } else {
                dialogueLayer.style.opacity = '0';
                setTimeout(() => { 
                    dialogueLayer.style.display = 'none'; 
                    triggerGrandClimax(); 
                }, 1500);
            }
        }
        setTimeout(showNextMessage, 500);
    }, 2000); 
}

// --- 6. Grand Climax ---
function triggerGrandClimax() {
    if(bgMusic) { let vol = 0.2; let fade = setInterval(() => { vol += 0.05; if(vol >= 1) { clearInterval(fade); vol = 1; } bgMusic.volume = vol; }, 150); }
    bgClimaxDark.style.opacity = '1';
    
    setTimeout(() => {
        climaxLayer.classList.remove('hidden'); 
        partyBanner.classList.remove('hidden');
        setTimeout(() => partyBanner.classList.add('drop'), 100); 
        fireMassiveConfetti();
    }, 400); 
}

function fireMassiveConfetti() {
    const end = Date.now() + 1500; const colors = ['#FFD700', '#D4AF37', '#ffffff', '#888888']; 
    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors, zIndex: 9999 });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors, zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}