"use client";
import { useEffect, useRef } from "react";

export function ParallaxStarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const stars = useRef<{x: number, y: number, z: number, o: number}[]>([]);
  const STAR_COUNT = 180;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Generate stars
    stars.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.7 + 0.3, // z for parallax depth
      o: Math.random() * 0.5 + 0.5, // opacity
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars.current) {
        ctx.save();
        ctx.globalAlpha = star.o;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.5 + 2 * (1 - star.z), 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,1)`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8 * (1 - star.z);
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      // Parallax effect: move stars slowly horizontally
      for (const star of stars.current) {
        star.x += 0.02 * (1 - star.z) * width * 0.001;
        if (star.x > width) star.x = 0;
      }
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      // Re-generate stars for new size
      stars.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.7 + 0.3,
        o: Math.random() * 0.5 + 0.5,
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none bg-transparent"
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, background: "transparent" }}
      aria-hidden="true"
    />
  );
} 