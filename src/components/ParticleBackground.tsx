import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    pulse: number;
    pulseSpeed: number;
}

const COLORS = [
    'rgba(124,58,237,',   // purple
    'rgba(6,182,212,',    // cyan
    'rgba(167,139,250,',  // lavender
];

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const PARTICLE_COUNT = 90;
        const MAX_DIST = 150;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const spawn = (): Particle => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            size: Math.random() * 1.5 + 0.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02,
        });

        const init = () => {
            resize();
            particles = Array.from({ length: PARTICLE_COUNT }, spawn);
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const opacity = (1 - dist / MAX_DIST) * 0.35;
                        // Alternate color per connection based on index
                        const col = i % 2 === 0 ? `rgba(124,58,237,${opacity})` : `rgba(6,182,212,${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        // Slightly curved lines for organic feel
                        const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 4;
                        const my = (a.y + b.y) / 2 + (Math.random() - 0.5) * 4;
                        ctx.quadraticCurveTo(mx, my, b.x, b.y);
                        ctx.strokeStyle = col;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (const p of particles) {
                p.pulse += p.pulseSpeed;
                const glow = 0.6 + 0.4 * Math.sin(p.pulse);
                const radius = p.size * glow;

                // Outer glow ring
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 5);
                grad.addColorStop(0, `${p.color}${(0.5 * glow).toFixed(2)})`);
                grad.addColorStop(1, `${p.color}0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius * 5, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${glow.toFixed(2)})`;
                ctx.fill();

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Soft bounce at edges
                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > width) { p.x = width; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > height) { p.y = height; p.vy *= -1; }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        init();
        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none', zIndex: 0 }}
        />
    );
}
