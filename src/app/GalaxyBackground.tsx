"use client";

import React, { useEffect, useRef } from "react";

export interface GalaxyThemeConfig {
  spaceBg: string;
  nebula1: string;
  nebula2: string;
  nebula3?: string;
  starColor: string;
  accentGlow: string;
}

interface GalaxyBackgroundProps {
  themeConfig: GalaxyThemeConfig;
}

interface Star {
  x: number;
  y: number;
  z: number;
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

  useEffect(() => {
    themeRef.current = themeConfig;
  }, [themeConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isMobile = false;

    const updateDimensions = () => {
      if (!canvas) return;
      isMobile = window.innerWidth < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    updateDimensions();

    let resizeTimeout: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const maxStarsLimit = isMobile ? 65 : 180;
    const numStars = Math.min(Math.floor((width * height) / (isMobile ? 12000 : 7000)), maxStarsLimit);
    const stars: Star[] = [];

    const starColors = ["#ffffff", "#e0e7ff", "#f3e8ff", "#bae6fd", "#fef08a"];

    for (let i = 0; i < numStars; i++) {
      const z = Math.random() * 0.85 + 0.15;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: Math.random() * 1.2 * z + 0.35,
        baseAlpha: Math.random() * 0.65 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12 * z,
        vy: (Math.random() - 0.5) * 0.12 * z,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    const nebulaClouds: NebulaCloud[] = [
      { xRatio: 0.2, yRatio: 0.25, radiusRatio: 0.4, color: themeRef.current.nebula1, vx: 0.0001, vy: 0.0001, phase: 0 },
      { xRatio: 0.8, yRatio: 0.7, radiusRatio: 0.45, color: themeRef.current.nebula2, vx: -0.0001, vy: -0.0001, phase: Math.PI / 2 },
      { xRatio: 0.5, yRatio: 0.85, radiusRatio: 0.35, color: themeRef.current.nebula3 || themeRef.current.nebula1, vx: 0.00012, vy: -0.00008, phase: Math.PI },
    ];

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
        length: Math.random() * 70 + 40,
        speed: Math.random() * 7 + 5,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
        active: true,
      };
    };

    let shootingStarTimer = 0;
    let lastFrameTime = performance.now();
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = currentTime - (elapsed % frameInterval);

      currentMouseX += (targetMouseX - currentMouseX) * 0.025;
      currentMouseY += (targetMouseY - currentMouseY) * 0.025;
      const mouseOffsetX = (currentMouseX - width / 2) * 0.015;
      const mouseOffsetY = (currentMouseY - height / 2) * 0.015;

      const activeThemeConfig = themeRef.current;

      ctx.fillStyle = activeThemeConfig.spaceBg || "#090a0f";
      ctx.fillRect(0, 0, width, height);

      const nebulaPalette = [
        activeThemeConfig.nebula1,
        activeThemeConfig.nebula2,
        activeThemeConfig.nebula3 || activeThemeConfig.nebula1,
      ];

      for (let index = 0; index < nebulaClouds.length; index++) {
        const cloud = nebulaClouds[index];
        cloud.phase += 0.002;
        const color = nebulaPalette[index % nebulaPalette.length];
        const pulse = Math.sin(cloud.phase) * 0.04 + 1;
        const radius = Math.min(width, height) * cloud.radiusRatio * pulse;

        const cx = width * cloud.xRatio + mouseOffsetX * (index + 1) * 0.3;
        const cy = height * cloud.yRatio + mouseOffsetY * (index + 1) * 0.3;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(0.7, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.25 + 0.75;
        const alpha = star.baseAlpha * twinkle * 0.7;

        star.x += star.vx;
        star.y += star.vy;

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
      }
      ctx.globalAlpha = 1.0;

      shootingStarTimer++;
      if (!shootingStar.active && shootingStarTimer > 350 && Math.random() < 0.008) {
        spawnShootingStar();
        shootingStarTimer = 0;
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.015;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        } else {
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha * 0.6})`);
          grad.addColorStop(0.4, `rgba(255, 255, 255, ${shootingStar.alpha * 0.2})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transform-gpu will-change-transform transition-opacity duration-700 opacity-90"
    />
  );
};

export default GalaxyBackground;
