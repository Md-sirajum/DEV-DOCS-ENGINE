/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

export default function NetworkBackground() {
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Probe for video presence
  useEffect(() => {
    // We will probe using a non-blocking fetch request first, or a straight video load check
    const checkVideo = async () => {
      try {
        const response = await fetch('/assets/bg-video.mp4', { method: 'HEAD' });
        if (response.ok) {
          setVideoAvailable(true);
        } else {
          setVideoAvailable(false);
        }
      } catch {
        setVideoAvailable(false);
      }
    };
    checkVideo();
  }, []);

  // Neural network canvas anim
  useEffect(() => {
    if (videoAvailable) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle settings
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hue: number;
    }

    const particleCount = Math.min(80, Math.floor((width * height) / 15000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        hue: Math.random() > 0.8 ? 180 : 210, // Teal & Cyan glows
      });
    }

    // Interactive pointer tracker
    const pointer = { x: -9999, y: -9999, active: false };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      pointer.active = true;
      if ('touches' in e) {
        if (e.touches.length > 0) {
          pointer.x = e.touches[0].clientX;
          pointer.y = e.touches[0].clientY;
        }
      } else {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#090a10');
      bgGrad.addColorStop(1, '#020205');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyber grid overlay lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive pointer avoidance / attraction
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            // Soft push
            p.x -= (dx / dist) * 0.35;
            p.y -= (dy / dist) * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 180 ? 'rgba(45, 212, 191, 0.65)' : 'rgba(56, 189, 248, 0.65)';
        ctx.shadowColor = p.hue === 180 ? '#2dd4bf' : '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Connections between close particles
      ctx.lineWidth = 0.65;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connections to user pointer
        if (pointer.active) {
          const dx = p1.x - pointer.x;
          const dy = p1.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.35;
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoAvailable]);

  const handleVideoError = () => {
    setVideoAvailable(false);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 -z-50 h-full w-full overflow-hidden bg-zinc-950">
      {videoAvailable ? (
        <video
          ref={videoRef}
          src="/assets/bg-video.mp4"
          className="h-full w-full object-cover opacity-30 select-none grayscale brightness-50"
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
        />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}
