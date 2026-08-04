"use client";

import React, { useEffect, useRef } from "react";

export interface GalaxyThemeConfig {
  spaceBg: string; // e.g. "#05050c"
  nebula1: string; // rgba(168, 85, 247, 0.25)
  nebula2: string; // rgba(99, 102, 241, 0.2)
  nebula3?: string; // rgba(236, 72, 153, 0.15)
  starColor: string; // "#ffffff" or "#e2e8f0"
  accentGlow: string; // "#a855f7"
}

interface GalaxyBackgroundProps {
  themeConfig: GalaxyThemeConfig;
}

interface Star {
  x: number;
  y: number;
  z: number; // depth scale 0.1 to 1.0
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string;
}

interface NebulaCloud {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ themeConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<GalaxyThemeConfig>(themeConfig);

  // Keep ref up to date for smooth loop transitions without re-init
  useEffect(() => {
    themeRef.current = themeConfig;
  }, [themeConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse drift influence
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const isMobile = width < 640;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Generate Stars (Optimized for mobile GPUs)
    const maxStarsLimit = isMobile ? 130 : 320;
    const numStars = Math.min(Math.floor((width * height) / (isMobile ? 7000 : 4500)), maxStarsLimit);
    const stars: Star[] = [];

    const starColors = ["#ffffff", "#e0e7ff", "#f3e8ff", "#bae6fd", "#fef08a"];

    for (let i = 0; i < numStars; i++) {
      const z = Math.random() * 0.9 + 0.1;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: Math.random() * 1.5 * z + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15 * z,
        vy: (Math.random() - 0.5) * 0.15 * z,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Generate Floating Nebula Clouds
    const nebulaClouds: NebulaCloud[] = [
      { xRatio: 0.2, yRatio: 0.25, radiusRatio: 0.45, color: themeRef.current.nebula1, vx: 0.0001, vy: 0.0001, phase: 0 },
      { xRatio: 0.8, yRatio: 0.7, radiusRatio: 0.5, color: themeRef.current.nebula2, vx: -0.0001, vy: -0.0001, phase: Math.PI / 2 },
      { xRatio: 0.5, yRatio: 0.85, radiusRatio: 0.4, color: themeRef.current.nebula3 || themeRef.current.nebula1, vx: 0.00012, vy: -0.00008, phase: Math.PI },
    ];

    // Shooting Star Manager
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };

    const spawnShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
        active: true,
      };
    };

    let shootingStarTimer = 0;

    // Render loop
    const render = () => {
      // Ease mouse position
      currentMouseX += (targetMouseX - currentMouseX) * 0.03;
      currentMouseY += (targetMouseY - currentMouseY) * 0.03;
      const mouseOffsetX = (currentMouseX - width / 2) * 0.02;
      const mouseOffsetY = (currentMouseY - height / 2) * 0.02;

      // Clear Canvas
      ctx.fillStyle = themeRef.current.spaceBg || "#05050c";
      ctx.fillRect(0, 0, width, height);

      // Draw Nebula Clouds
      const activeThemeConfig = themeRef.current;
      const nebulaPalette = [
        activeThemeConfig.nebula1,
        activeThemeConfig.nebula2,
        activeThemeConfig.nebula3 || activeThemeConfig.nebula1,
      ];

      nebulaClouds.forEach((cloud, index) => {
        cloud.phase += 0.003;
        const color = nebulaPalette[index % nebulaPalette.length];
        const pulse = Math.sin(cloud.phase) * 0.08 + 1;
        const radius = Math.min(width, height) * cloud.radiusRatio * pulse;

        const cx = width * cloud.xRatio + mouseOffsetX * (index + 1) * 0.5;
        const cy = height * cloud.yRatio + mouseOffsetY * (index + 1) * 0.5;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, color.replace(/[\d.]+\)$/, "0.08)"));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw & Update Stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        const alpha = star.baseAlpha * twinkle;

        star.x += star.vx;
        star.y += star.vy;

        // Wrap around bounds
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const renderX = star.x + mouseOffsetX * star.z;
        const renderY = star.y + mouseOffsetY * star.z;

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Subtle glow for larger foreground stars
        if (star.z > 0.75) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = activeThemeConfig.accentGlow || star.color;
          ctx.globalAlpha = alpha * 0.25;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // Shooting Star Animation
      shootingStarTimer++;
      if (!shootingStar.active && shootingStarTimer > 400 && Math.random() < 0.008) {
        spawnShootingStar();
        shootingStarTimer = 0;
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.012;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        } else {
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
          grad.addColorStop(0.3, activeThemeConfig.accentGlow || `rgba(168, 85, 247, ${shootingStar.alpha * 0.6})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-90"
    />
  );
};

export default GalaxyBackground;
