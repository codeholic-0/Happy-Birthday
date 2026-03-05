const friendName = "Sreshtha"; 

const nameSpan = document.getElementById('friendName');
nameSpan.innerText = friendName.toUpperCase();

const introLayer = document.getElementById('intro-layer');
const giftBox = document.getElementById('gift-box-container');
const giftText = document.querySelector('.gift-text');
const bgMusic = document.getElementById('bg-music');

const bgTwilight = document.getElementById('bg-twilight');
const bgClimaxSunset = document.getElementById('bg-climax-sunset');

const constellationLayer = document.getElementById('constellation-layer');
const dialogueLayer = document.getElementById('dialogue-layer');
const climaxLayer = document.getElementById('climax-layer');

const starNodes = document.querySelectorAll('.star-node');
const partyBanner = document.getElementById('party-banner');
const instructionText = document.querySelector('.instruction-text');
const dialogueText = document.getElementById('dialogue-text');

const photoOverlay = document.getElementById('photo-overlay');
const overlayImg = document.getElementById('overlay-img');
const overlayCaption = document.getElementById('overlay-caption');

// --- BACK BUTTON / SWIPE TRAP (4TH PHASE) ---
// Pushes a state immediately so we can intercept the user going back
history.pushState(null, null, location.href);
window.addEventListener('popstate', function(event) {
    // Push it back again to prevent them from actually leaving the page
    history.pushState(null, null, location.href); 
    showOutroLayer();
});

function showOutroLayer() {
    // Hide all other active layers abruptly
    introLayer.style.display = 'none';
    constellationLayer.style.display = 'none';
    dialogueLayer.style.display = 'none';
    climaxLayer.style.display = 'none';
    
    // Show the "See you next year" layer
    const outroLayer = document.getElementById('outro-layer');
    if(outroLayer) {
        outroLayer.classList.remove('hidden');
        outroLayer.style.display = 'flex';
        // Small timeout allows display: flex to apply before transitioning opacity
        setTimeout(() => {
            outroLayer.style.opacity = '1';
        }, 50);
    }
}

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

let lastParticleTime = 0;
function handleTrail(x, y) {
    if (Date.now() - lastParticleTime > 50) { 
        createParticle(x, y);
        lastParticleTime = Date.now();
    }
}
window.addEventListener('mousemove', (e) => handleTrail(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => handleTrail(e.touches[0].clientX, e.touches[0].clientY));

// --- 1. PERFECT GEOMETRIC STAR FORMATION ---
let cx, cy, outerRadius, innerRadius;

function setupStarFormation() {
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    outerRadius = minDim * 0.38; 
    innerRadius = outerRadius * 0.382; // The mathematically perfect inner ratio for a 5-point star
    
    cx = window.innerWidth / 2;
    cy = window.innerHeight * 0.50; 

    const coreNode = document.querySelector('.star-node[data-index="0"]');
    if(coreNode) {
        coreNode.style.left = `${cx}px`;
        coreNode.style.top = `${cy}px`;
    }

    for(let i = 1; i <= 5; i++) {
        const node = document.querySelector(`.star-node[data-index="${i}"]`);
        const angle = -Math.PI / 2 + ((i - 1) * (2 * Math.PI / 5));
        
        const leftPx = cx + (outerRadius * Math.cos(angle));
        const topPx = cy + (outerRadius * Math.sin(angle));
        
        node.style.left = `${leftPx}px`;
        node.style.top = `${topPx}px`;
    }
}
setupStarFormation(); 

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    setupStarFormation();
});

// --- 2. Box Chase Logic ---
let taps = 0; const maxTaps = 5;
let introStarted = false; 
let currentCornerIndex = -1; 

giftBox.addEventListener('click', (e) => {
    e.preventDefault(); 
    if (introStarted) return; 
    
    taps++;
    
    if (taps < maxTaps - 1) {
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

        let nextCornerIndex;
        do {
            nextCornerIndex = Math.floor(Math.random() * corners.length);
        } while (nextCornerIndex === currentCornerIndex);
        
        currentCornerIndex = nextCornerIndex;
        let corner = corners[currentCornerIndex];

        giftBox.style.left = `${corner.x}px`; 
        giftBox.style.top = `${corner.y}px`;
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
let unlockedCount = 0; let currentViewingNode = null; 

function startConstellationPhase() {
    constellationLayer.classList.remove('hidden'); 
    const firstStar = document.querySelector('.star-node[data-index="1"]');
    if (firstStar) firstStar.classList.add('visible-star');
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
    photoOverlay.classList.remove('active'); 
    const node = currentViewingNode; 
    currentViewingNode = null; 
    
    node.classList.add('unlocked');
    const rect = node.getBoundingClientRect(); 
    for(let i=0; i<40; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
    
    unlockedCount++;

    if (unlockedCount < 5) {
        const nextStar = document.querySelector(`.star-node[data-index="${unlockedCount + 1}"]`);
        if (nextStar) nextStar.classList.add('visible-star');
    } 
    else if (unlockedCount === 5) {
        setTimeout(() => {
            const cStar = document.querySelector('.star-node[data-index="0"]');
            cStar.classList.remove('hidden-core'); cStar.classList.add('reveal-core');
            instructionText.innerText = "The core is ready...";
            const cRect = cStar.getBoundingClientRect(); for(let i=0; i<40; i++) createParticle(cRect.left + cRect.width/2, cRect.top + cRect.height/2);
        }, 800); 
    }
    
    if(unlockedCount === 6) { 
        instructionText.style.opacity = '0'; 
        
        const svgCanvas = document.getElementById('constellation-lines');
        svgCanvas.innerHTML = ''; 
        
        let points = [];
        for(let i = 0; i < 5; i++) {
            let angleOuter = -Math.PI / 2 + (i * (2 * Math.PI / 5));
            let ox = cx + outerRadius * Math.cos(angleOuter);
            let oy = cy + outerRadius * Math.sin(angleOuter);
            points.push({x: ox, y: oy});

            let angleInner = -Math.PI / 2 + (i * (2 * Math.PI / 5)) + (Math.PI / 5);
            let ix = cx + innerRadius * Math.cos(angleInner);
            let iy = cy + innerRadius * Math.sin(angleInner);
            points.push({x: ix, y: iy});
        }
        
        points.forEach((p1, index) => {
            let p2 = points[(index + 1) % points.length];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', p1.x); 
            line.setAttribute('y1', p1.y);
            line.setAttribute('x2', p2.x); 
            line.setAttribute('y2', p2.y);
            line.classList.add('constellation-line'); 
            svgCanvas.appendChild(line);
            
            setTimeout(() => line.classList.add('drawn'), index * 100);
        });

        setTimeout(() => {
            constellationLayer.classList.add('revert-to-stars');
            setTimeout(playDialogue, 2000); 
        }, 1500); 
    }
});

// --- 5. Dialogue Transition ---
const messages = [
    "From my random thought at the afternoon...",
    "And the 2hrs I have spent on this...",
    "There is only one thing left to say..."
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
    bgClimaxSunset.style.opacity = '1';
    
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