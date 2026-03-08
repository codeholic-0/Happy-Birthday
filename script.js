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

// ─── BACK BUTTON / SWIPE TRAP ───
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
    history.pushState(null, null, location.href);
    showOutroLayer();
});

function showOutroLayer() {
    introLayer.style.display = 'none';
    constellationLayer.style.display = 'none';
    dialogueLayer.style.display = 'none';
    climaxLayer.style.display = 'none';
    const outroLayer = document.getElementById('outro-layer');
    if (outroLayer) {
        outroLayer.classList.remove('hidden');
        outroLayer.style.display = 'flex';
        setTimeout(() => { outroLayer.style.opacity = '1'; }, 50);
    }
}

// ─── 0. STARDUST CANVAS ───
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function drawStar(cx, cy, spikes, outerR, innerR) {
    let rot = Math.PI / 2 * 3;
    let x = cx, y = cy;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y); rot += step;
        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y); rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
}

// Expanded palette for particle colors
const PARTICLE_COLORS = [
    [255, 215, 0],   // gold
    [255, 180, 60],  // amber
    [255, 100, 150], // pink
    [180, 120, 255], // purple
    [100, 230, 255], // cyan
    [255, 255, 255], // white
];

function createParticle(x, y, count = 1) {
    for (let k = 0; k < count; k++) {
        const col = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        particles.push({
            x: x + (Math.random() * 40 - 20),
            y: y + (Math.random() * 40 - 20),
            size: Math.random() * 3.5 + 1.5,
            speedX: (Math.random() - 0.5) * 1.6,
            speedY: (Math.random() - 0.5) * 1.6,
            life: 1,
            decay: 0.016 + Math.random() * 0.01,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            color: col,
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= p.decay;
        p.rotation += p.rotSpeed;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 1)`;
        // Larger particles: 4-pointed diamond sparkle
        if (p.size > 3) {
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.8);
            ctx.lineTo(p.size * 0.5, 0);
            ctx.lineTo(0, p.size * 1.8);
            ctx.lineTo(-p.size * 0.5, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            drawStar(0, 0, 5, p.size, p.size / 2);
        }
        ctx.restore();
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

let lastParticleTime = 0;
function handleTrail(x, y) {
    if (Date.now() - lastParticleTime > 55) {
        createParticle(x, y, 1);
        lastParticleTime = Date.now();
    }
}
window.addEventListener('mousemove', (e) => handleTrail(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTrail(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

// ─── 1. STAR FORMATION SETUP ───
let cx, cy, outerRadius, innerRadius;

function setupStarFormation() {
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    outerRadius = minDim * 0.38;
    innerRadius = outerRadius * 0.382;
    cx = window.innerWidth / 2;
    cy = window.innerHeight * 0.50;

    const coreNode = document.querySelector('.star-node[data-index="0"]');
    if (coreNode) {
        coreNode.style.left = `${cx}px`;
        coreNode.style.top = `${cy}px`;
    }
    for (let i = 1; i <= 5; i++) {
        const node = document.querySelector(`.star-node[data-index="${i}"]`);
        const angle = -Math.PI / 2 + ((i - 1) * (2 * Math.PI / 5));
        node.style.left = `${cx + outerRadius * Math.cos(angle)}px`;
        node.style.top = `${cy + outerRadius * Math.sin(angle)}px`;
    }
}
setupStarFormation();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setupStarFormation();
});

// ─── 2. GIFT BOX CHASE ───
let taps = 0;
const maxTaps = 5;
let introStarted = false;
let currentCornerIndex = -1;

// Silly captions — more of them!
const teaseCaptions = [
    "Catch me! 😜",
    "Nope, here! 👀",
    "So slow! 😜",
    "Almost... 🤭",
    "Too fast for you! 😈",
    "Hehe, nope! 🏃",
    "Open me! 🎁"
];

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
            { x: w - padding - boxWidth, y: h - padding - boxWidth },
        ];

        let nextCornerIndex;
        do {
            nextCornerIndex = Math.floor(Math.random() * corners.length);
        } while (nextCornerIndex === currentCornerIndex);

        currentCornerIndex = nextCornerIndex;
        const corner = corners[currentCornerIndex];

        giftBox.style.left = `${corner.x}px`;
        giftBox.style.top = `${corner.y}px`;
        giftBox.style.transform = 'translate(-50%, -50%)';

        giftText.innerText = teaseCaptions[taps - 1] || "";

        // Burst of particles at tap point
        createParticle(e.clientX, e.clientY, 12);

        if (navigator.vibrate) navigator.vibrate(50);

    } else if (taps === maxTaps - 1) {
        giftBox.style.left = '50%';
        giftBox.style.top = '50%';
        giftBox.style.transform = 'translate(-50%, -50%)';
        giftText.innerText = "Open me! 🎁";
        createParticle(e.clientX, e.clientY, 12);

    } else if (taps >= maxTaps) {
        introStarted = true;
        createParticle(e.clientX, e.clientY, 30);
        playIntroDialogue();
    }
});

// ─── 3. INTRO TRANSITION ───
function playIntroDialogue() {
    if (bgMusic) { bgMusic.volume = 0.2; bgMusic.play().catch(e => console.log("Audio skipped")); }

    giftBox.style.transform = 'translate(-50%, -50%) scale(0)';

    // Fade in twilight + enable ambient orbs
    bgTwilight.style.opacity = '1';
    document.body.classList.add('twilight-active');

    setTimeout(() => {
        introLayer.style.opacity = '0';
        setTimeout(() => {
            introLayer.style.display = 'none';

            dialogueLayer.style.display = 'flex';
            dialogueLayer.classList.remove('hidden');
            dialogueLayer.style.opacity = '1';

            setTimeout(() => {
                dialogueText.innerText = "Let's look at the stars ✨";
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
            }, 500);
        }, 1000);
    }, 300);
}

// ─── 4. CONSTELLATION PHASE ───
let unlockedCount = 0;
let currentViewingNode = null;

function startConstellationPhase() {
    constellationLayer.classList.remove('hidden');
    const firstStar = document.querySelector('.star-node[data-index="1"]');
    if (firstStar) firstStar.classList.add('visible-star');
}

starNodes.forEach(node => {
    node.addEventListener('click', () => {
        if (node.classList.contains('unlocked') || currentViewingNode) return;
        currentViewingNode = node;
        overlayImg.src = node.querySelector('img').src;
        overlayCaption.innerText = node.querySelector('.caption').innerText;
        photoOverlay.classList.add('active');
    });
});

photoOverlay.addEventListener('click', () => {
    if (!currentViewingNode) return;
    photoOverlay.classList.remove('active');

    const node = currentViewingNode;
    currentViewingNode = null;

    node.classList.add('unlocked');

    const rect = node.getBoundingClientRect();
    createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    unlockedCount++;

    if (unlockedCount < 5) {
        const nextStar = document.querySelector(`.star-node[data-index="${unlockedCount + 1}"]`);
        if (nextStar) nextStar.classList.add('visible-star');
    } else if (unlockedCount === 5) {
        setTimeout(() => {
            const cStar = document.querySelector('.star-node[data-index="0"]');
            cStar.classList.remove('hidden-core');
            cStar.classList.add('reveal-core');
            instructionText.innerText = "The core is ready...";
            const cRect = cStar.getBoundingClientRect();
            createParticle(cRect.left + cRect.width / 2, cRect.top + cRect.height / 2, 50);
        }, 800);
    }

    if (unlockedCount === 6) {
        instructionText.style.opacity = '0';

        // Draw star constellation lines
        const svgCanvas = document.getElementById('constellation-lines');
        svgCanvas.innerHTML = '';

        let points = [];
        for (let i = 0; i < 5; i++) {
            const angleOuter = -Math.PI / 2 + (i * (2 * Math.PI / 5));
            points.push({
                x: cx + outerRadius * Math.cos(angleOuter),
                y: cy + outerRadius * Math.sin(angleOuter),
            });
            const angleInner = -Math.PI / 2 + (i * (2 * Math.PI / 5)) + (Math.PI / 5);
            points.push({
                x: cx + innerRadius * Math.cos(angleInner),
                y: cy + innerRadius * Math.sin(angleInner),
            });
        }

        points.forEach((p1, index) => {
            const p2 = points[(index + 1) % points.length];
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

// ─── 5. DIALOGUE TRANSITION ───
const messages = [
    "From my random thought this afternoon...",
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

// ─── 6. GRAND CLIMAX ───
function triggerGrandClimax() {
    // Fade music up
    if (bgMusic) {
        let vol = 0.2;
        const fade = setInterval(() => {
            vol += 0.05;
            if (vol >= 1) { clearInterval(fade); vol = 1; }
            bgMusic.volume = vol;
        }, 150);
    }

    bgClimaxSunset.style.opacity = '1';

    setTimeout(() => {
        climaxLayer.classList.remove('hidden');
        partyBanner.classList.remove('hidden');
        setTimeout(() => partyBanner.classList.add('drop'), 100);
        fireMassiveConfetti();
    }, 400);
}

function fireMassiveConfetti() {
    const end = Date.now() + 2200;
    const colors = ['#FFD700', '#D4AF37', '#ff3d80', '#00e5c8', '#b366ff', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60, spread: 60,
            origin: { x: 0, y: 0.75 },
            colors: colors, zIndex: 9999,
            scalar: 1.1,
        });
        confetti({
            particleCount: 4,
            angle: 120, spread: 60,
            origin: { x: 1, y: 0.75 },
            colors: colors, zIndex: 9999,
            scalar: 1.1,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}
