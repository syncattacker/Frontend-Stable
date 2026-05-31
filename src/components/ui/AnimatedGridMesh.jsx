"use client";

import { useEffect, useRef } from "react";

const AnimatedGridMesh = ({ color = "124,82,255", opacity = 0.6 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let t = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const parallaxX = (mx - 0.5) * 24;
      const parallaxY = (my - 0.5) * 10;

      const horizon = H * 0.45 + parallaxY;

      const vp = {
        x: W * 0.5 + parallaxX,
        y: horizon,
      };

      const horizGrad = ctx.createRadialGradient(
        vp.x,
        vp.y,
        0,
        vp.x,
        vp.y,
        W * 0.55
      );

      horizGrad.addColorStop(0, `rgba(${color},${opacity * 0.18})`);
      horizGrad.addColorStop(1, `rgba(${color},0)`);

      ctx.fillStyle = horizGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.save();

      const COLS = 12;
      const ROWS = 14;
      const bottom = H + 60;

      for (let c = 0; c <= COLS; c++) {
        const xBase = (c / COLS) * W;
        const xHor = vp.x + (xBase - vp.x) * 0.0;

        ctx.beginPath();
        ctx.moveTo(xHor, vp.y);
        ctx.lineTo(xBase, bottom);

        const dist = Math.abs(c - COLS / 2) / (COLS / 2);
        const lineAlpha = (0.4 - dist * 0.28) * opacity;

        ctx.strokeStyle = `rgba(${color},${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (let r = 0; r <= ROWS; r++) {
        const progress = r / ROWS;

        const fov = Math.pow(progress, 1.8);
        const y = vp.y + (bottom - vp.y) * fov;

        const spread = fov;

        const x0 = vp.x - (W * 0.5 + 60) * spread;
        const x1 = vp.x + (W * 0.5 + 60) * spread;

        const rowAlpha = (0.08 + fov * 0.25) * opacity;

        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);

        ctx.strokeStyle = `rgba(${color},${rowAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      const scanProgress = (t * 0.35) % 1;
      const fovScan = Math.pow(scanProgress, 1.8);

      const scanY = vp.y + (bottom - vp.y) * fovScan;
      const scanSpread = fovScan;

      const scanX0 = vp.x - (W * 0.5 + 60) * scanSpread;
      const scanX1 = vp.x + (W * 0.5 + 60) * scanSpread;

      const scanG = ctx.createLinearGradient(scanX0, scanY, scanX1, scanY);

      scanG.addColorStop(0, `rgba(${color},0)`);
      scanG.addColorStop(0.3, `rgba(${color},0)`);
      scanG.addColorStop(0.5, `rgba(${color},${0.55 * opacity})`);
      scanG.addColorStop(0.7, `rgba(${color},0)`);
      scanG.addColorStop(1, `rgba(${color},0)`);

      ctx.beginPath();
      ctx.moveTo(scanX0, scanY);
      ctx.lineTo(scanX1, scanY);

      ctx.strokeStyle = scanG;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const skyGrad = ctx.createLinearGradient(0, 0, 0, vp.y);

      skyGrad.addColorStop(0, "rgba(0,0,0,0.92)");
      skyGrad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, vp.y);

      ctx.restore();

      t += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
};

export default AnimatedGridMesh;