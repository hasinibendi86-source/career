import React, { useEffect, useRef } from 'react';

export default function PerformanceRadar({
  scores = {
    academic_score: 80,
    technical_score: 75,
    aptitude_score: 70,
    communication_score: 80,
    experience_score: 65,
  },
  size = 280
}) {
  const canvasRef = useRef(null);

  const axes = [
    { key: 'academic_score', label: 'Academics' },
    { key: 'technical_score', label: 'Technical' },
    { key: 'aptitude_score', label: 'Aptitude' },
    { key: 'communication_score', label: 'Communication' },
    { key: 'experience_score', label: 'Experience' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.38;
    const totalAxes = axes.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    ctx.clearRect(0, 0, size, size);

    // Draw concentric polygon webs
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach((lvl) => {
      ctx.beginPath();
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * maxRadius * lvl;
        const y = centerY + Math.sin(angle) * maxRadius * lvl;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = lvl === 1.0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw axis lines and labels
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // Axis label
      const labelDist = maxRadius + 22;
      const lx = centerX + Math.cos(angle) * labelDist;
      const ly = centerY + Math.sin(angle) * labelDist;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axes[i].label, lx, ly);
    }

    // Draw student data polygon
    ctx.beginPath();
    const points = [];
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const scoreVal = Math.min(100, Math.max(0, scores[axes[i].key] || 0));
      const dist = (scoreVal / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      points.push({ x, y, scoreVal });

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Polygon fill
    const polyGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxRadius);
    polyGradient.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
    polyGradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)');
    ctx.fillStyle = polyGradient;
    ctx.fill();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw vertex markers
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }, [scores, size]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="mx-auto"
        />
      </div>

      {/* Numerical metric pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 w-full max-w-sm">
        {axes.map((ax) => (
          <div
            key={ax.key}
            className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03] border border-white/5"
          >
            <span className="text-[11px] text-slate-400 font-medium truncate">{ax.label}</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {Math.round(scores[ax.key] || 0)}
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">/100</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
