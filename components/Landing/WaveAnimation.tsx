import React, { useEffect, HTMLProps } from "react";

interface WaveAnimationProps extends HTMLProps<HTMLCanvasElement> {
  className?: string;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({ className }) => {
  useEffect(() => {
    const canvas = document.getElementById(
      "waveCanvas",
    ) as HTMLCanvasElement | null;
    if (canvas === null) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    let width: number, height: number;
    let wave_height: number;

    let p1 = {
      segments: 10,
      speed: 2,
      shape: 1.9,
      height: 1,
    };

    let p2 = {
      speed: 0.8,
      shape: 1.5,
      height: 4,
    };

    let p3 = {
      speed: 1.5,
      shape: 1.8,
      height: 41,
    };

    let h2 = 0,
      up = false;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      wave_height = height / 2 + 200;
    };

    const draw = (time: number) => {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      if (up === true) h2 -= 0.3;
      else h2 += 0.3;
      if (h2 > 30) up = true;
      if (h2 < -40) up = false;

      ctx.fillStyle = "#093da8";
      ctx.strokeStyle = "rgba(76,154,240,1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= p1.segments + 1; i++) {
        const x = (width / p1.segments) * i;
        const sinus = Math.sin(time * 0.001 * p1.speed + i / p1.shape);
        const y = sinus * 40 + wave_height + p1.height;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 5, height + 5);
      ctx.lineTo(-5, height + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#05acec");
      gradient.addColorStop(1, "#0072ff");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i <= p1.segments + 1; i++) {
        const x = (width / p1.segments) * i;
        const sinus = Math.sin(time * 0.001 * p2.speed + i / p2.shape);
        const y = sinus * 30 + h2 + wave_height + p2.height;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 5, height + 5);
      ctx.lineTo(-5, height + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(13,92,180,1)";
      ctx.beginPath();
      for (let i = 0; i <= p1.segments + 1; i++) {
        const x = (width / p1.segments) * i;
        const sinus = Math.sin(time * 0.001 * p3.speed + i / p3.shape);
        const y = sinus * 20 + wave_height + p3.height;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 5, height + 5);
      ctx.lineTo(-5, height + 5);
      ctx.closePath();
      ctx.fill();
    };

    resizeCanvas();
    draw(0);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas id="waveCanvas" className={className} />;
};

export default WaveAnimation;
