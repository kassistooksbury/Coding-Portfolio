'use client';

import { useEffect, useRef } from 'react';
import './MetallicPaint.css';

const MetallicPaint = ({
  text,
  className = '',
  patternScale = 2,
  refraction = 0.015,
  edge = 1,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frame;
    let time = 0;

    const animate = () => {
      time += speed * 0.02;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = className;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw metallic effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#5227FF');
      gradient.addColorStop(1, '#FF9FFC');

      ctx.fillStyle = gradient;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Apply liquid metal effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);

        const distortion = Math.sin(x * patternScale + time) * Math.cos(y * patternScale + time) * liquid;
        const refract = Math.sin(x * refraction + time) * Math.cos(y * refraction + time);

        data[i] = data[i] + distortion * edge * 255;
        data[i + 1] = data[i + 1] + refract * patternBlur * 255;
        data[i + 2] = data[i + 2] + distortion * edge * 255;
      }

      ctx.putImageData(imageData, 0, 0);
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [text, className, patternScale, refraction, edge, patternBlur, liquid, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={300}
      height={100}
    />
  );
};

export default MetallicPaint;
