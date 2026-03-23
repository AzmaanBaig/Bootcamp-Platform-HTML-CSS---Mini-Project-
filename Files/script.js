/* ═══════════════════════════════════════════════════════════════
   CODEQUEST PRO — THE SYSTEM
   script.js  |  All interactions, animations, particles
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. PARTICLE SYSTEM
   Floating blue mana particles across bg
───────────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#3d9fff', '#2a6fff', '#6bbfff', '#1a4fff', '#4a8fff'];

    const particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        dy: -(Math.random() * 0.35 + 0.05),
        dx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.4 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random() * 200,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            p.x += p.dx;
            p.y += p.dy;
            p.life += 1;

            // Reset particle when it leaves the screen or expires
            if (p.y < -10 || p.life > 400) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
                p.life = 0;
                p.alpha = Math.random() * 0.4 + 0.05;
            }

            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        });

        requestAnimationFrame(draw);
    }

    draw();
})();


/* ─────────────────────────────────────────
   2. SCROLL REVEAL
   IntersectionObserver for .reveal elements
───────────────────────────────────────── */
(function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   3. STATUS PANEL — Level counter animation
   Counts up from 0 to 47 like the System
   awakening a hunter for the first time
───────────────────────────────────────── */
(function initLevelCounter() {
    const lvlEl = document.getElementById('sp-level-num');
    if (!lvlEl) return;

    const TARGET = 47;
    let current = 0;

    // Wait a beat after page load before counting
    setTimeout(() => {
        const interval = setInterval(() => {
            current += Math.ceil((TARGET - current) / 5);
            if (current >= TARGET) {
                current = TARGET;
                clearInterval(interval);
            }
            lvlEl.textContent = String(current).padStart(2, '0');
        }, 80);
    }, 900);
})();


/* ─────────────────────────────────────────
   4. HP / MP BAR PULSE
   Bars gently fluctuate like a living system
───────────────────────────────────────── */
(function initBarPulse() {
    const hpBar = document.getElementById('hp-bar');
    const mpBar = document.getElementById('mp-bar');
    if (!hpBar || !mpBar) return;

    let hp = 88;
    let mp = 65;
    let hpDir = -1;
    let mpDir = 1;

    setInterval(() => {
        hp += hpDir * (Math.random() * 0.5);
        mp += mpDir * (Math.random() * 0.3);

        if (hp > 92) hpDir = -1;
        if (hp < 82) hpDir = 1;
        if (mp > 70) mpDir = -1;
        if (mp < 58) mpDir = 1;

        hpBar.style.width = hp.toFixed(1) + '%';
        mpBar.style.width = mp.toFixed(1) + '%';
    }, 2000);
})();


/* ─────────────────────────────────────────
   5. NOTIFICATION PANEL BUTTONS
   Yes → awakening confirmed
   No  → System doesn't accept cowardice
───────────────────────────────────────── */
(function initNotificationPanel() {
    const yesBtn = document.getElementById('sl-yes');
    const noBtn = document.getElementById('sl-no');
    const section = document.getElementById('notif-section');

    if (!yesBtn || !noBtn || !section) return;

    yesBtn.addEventListener('click', function() {
        const panel = this.closest('.sl-notification-panel');
        if (!panel) return;

        panel.style.transition = 'all 0.4s ease';
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.9)';

        setTimeout(() => {
            section.innerHTML = `
        <div class="notif-accepted">
          <div class="notif-accepted-icon">⚔</div>
          <div class="notif-accepted-sys">[ SYSTEM ]</div>
          <div class="notif-accepted-title">Awakening confirmed.</div>
          <div class="notif-accepted-sub">The journey begins now, Hunter.</div>
        </div>
      `;
        }, 400);
    });

    noBtn.addEventListener('click', function() {
        const panel = this.closest('.sl-notification-panel');
        const questionEl = panel ? panel.querySelector('.sl-notif-question') : null;
        if (!panel || !questionEl) return;

        // Briefly grey out the panel
        panel.style.transition = 'all 0.3s ease';
        panel.style.opacity = '0.3';
        panel.style.filter = 'grayscale(1)';

        setTimeout(() => {
            questionEl.textContent = 'The System does not accept cowardice.';
            noBtn.style.display = 'none';
            yesBtn.textContent = 'Fine. Yes.';
            panel.style.opacity = '1';
            panel.style.filter = 'none';
        }, 800);
    });
})();


/* ─────────────────────────────────────────
   6. NAVBAR — active link highlight
   on scroll position
───────────────────────────────────────── */
(function initNavHighlight() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(s => observer.observe(s));
})();


/* ─────────────────────────────────────────
   7. SMOOTH CTA BUTTON RIPPLE
───────────────────────────────────────── */
(function initRipple() {
    document.querySelectorAll('.cta-primary, .btn-primary, .sl-btn-yes').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');

            ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.35);
        left: ${e.clientX - rect.left - 5}px;
        top:  ${e.clientY - rect.top  - 5}px;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 99;
      `;

            // Inject keyframes once
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(30); opacity: 0; }
          }
        `;
                document.head.appendChild(style);
            }

            const position = window.getComputedStyle(this).position;
            if (position === 'static') this.style.position = 'relative';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });
})();


/* ─────────────────────────────────────────
   8. STAT COUNTER ANIMATION
   Animate the big numbers in the stats strip
   when they scroll into view
───────────────────────────────────────── */
(function initStatCounters() {
    const statBigs = document.querySelectorAll('.stat-big');
    if (!statBigs.length) return;

    // Store the original text values
    const targets = [];
    statBigs.forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);
        targets.push({
            el,
            start: 0,
            end: match ? parseInt(match[1], 10) : null,
            suffix: el.querySelector('.suffix') ? el.querySelector('.suffix').outerHTML : '',
            animated: false,
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const data = targets.find(t => t.el === entry.target);
                if (!data || data.animated || data.end === null) return;

                data.animated = true;
                observer.unobserve(entry.target);

                let current = 0;
                const frames = 50;
                const step = data.end / frames;

                const tick = setInterval(() => {
                    current += step;
                    if (current >= data.end) {
                        current = data.end;
                        clearInterval(tick);
                    }
                    data.el.innerHTML = Math.round(current) + data.suffix;
                }, 30);
            });
        }, { threshold: 0.5 }
    );

    targets.forEach(t => {
        if (t.end !== null) observer.observe(t.el);
    });
})();


/* ─────────────────────────────────────────
   9. TRUSTED LOGOS — staggered fade in
───────────────────────────────────────── */
(function initLogoFadeIn() {
    const logos = document.querySelectorAll('.trusted-logo');
    if (!logos.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    logos.forEach((logo, i) => {
                        setTimeout(() => {
                            logo.style.transition = 'opacity 0.5s ease, color 0.3s ease';
                            logo.style.opacity = '0.5';
                        }, i * 80);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 }
    );

    // Start invisible
    logos.forEach(logo => { logo.style.opacity = '0'; });

    const section = document.querySelector('.trusted-section');
    if (section) observer.observe(section);
})();


/* ─────────────────────────────────────────
   10. RANK CHIP HOVER GLOW
───────────────────────────────────────── */
(function initRankChips() {
    const GLOW_MAP = {
        e: 'rgba(148,163,184,0.25)',
        d: 'rgba(34,197,94,0.25)',
        c: 'rgba(59,130,246,0.25)',
        b: 'rgba(168,85,247,0.25)',
        a: 'rgba(249,115,22,0.25)',
        s: 'rgba(232,184,75,0.35)',
    };

    document.querySelectorAll('.rank-chip').forEach(chip => {
        const rankClass = Array.from(chip.classList).find(c => GLOW_MAP[c]);
        if (!rankClass) return;

        chip.addEventListener('mouseenter', () => {
            chip.style.boxShadow = `0 0 14px ${GLOW_MAP[rankClass]}`;
            chip.style.transform = 'translateY(-2px)';
        });
        chip.addEventListener('mouseleave', () => {
            chip.style.boxShadow = '';
            chip.style.transform = '';
        });
    });
})();


/* ─────────────────────────────────────────
   11. SYSTEM PANEL SCAN LINE
   Occasional sweep across the status panel
───────────────────────────────────────── */
(function initScanLine() {
    const panel = document.querySelector('.status-panel');
    if (!panel) return;

    // Inject scan-line style
    const style = document.createElement('style');
    style.textContent = `
    .scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(61,159,255,0.4), transparent);
      box-shadow: 0 0 10px rgba(61,159,255,0.4);
      pointer-events: none;
      z-index: 10;
      animation: scanMove 2s linear forwards;
    }
    @keyframes scanMove {
      from { top: 0%;   opacity: 1; }
      to   { top: 100%; opacity: 0; }
    }
    .notif-accepted {
      text-align: center;
      padding: 3rem 2rem;
    }
    .notif-accepted-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #3d9fff;
      text-shadow: 0 0 20px rgba(61,159,255,0.6);
    }
    .notif-accepted-sys {
      font-family: 'Lato', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 4px;
      color: #3d9fff;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .notif-accepted-title {
      font-family: 'Lato', sans-serif;
      font-size: 1.2rem;
      font-weight: 900;
      color: #e8f4ff;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }
    .notif-accepted-sub {
      font-size: 0.85rem;
      color: #5a8abf;
    }
    .nav-active {
      color: #6bbfff !important;
    }
    .nav-active::after {
      width: 100% !important;
    }
  `;
    document.head.appendChild(style);

    // Fire scan line every 8 seconds
    function fireScan() {
        const line = document.createElement('div');
        line.className = 'scan-line';
        panel.appendChild(line);
        setTimeout(() => line.remove(), 2100);
    }

    setTimeout(() => {
        fireScan();
        setInterval(fireScan, 8000);
    }, 3000);
})();