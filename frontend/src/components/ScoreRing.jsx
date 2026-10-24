import React, { useEffect, useState } from 'react';

export default function ScoreRing({
  score = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Score',
  sublabel = '',
  gradientId = 'scoreGrad',
  variant = 'default' // 'default', 'placement', 'ats'
}) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * score);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Determine colors
  let startColor = '#8b5cf6';
  let stopColor = '#ec4899';
  let glowColor = 'rgba(139, 92, 246, 0.4)';

  if (score >= 80) {
    startColor = '#10b981';
    stopColor = '#06b6d4';
    glowColor = 'rgba(16, 185, 129, 0.45)';
  } else if (score >= 60) {
    startColor = '#8b5cf6';
    stopColor = '#3b82f6';
    glowColor = 'rgba(139, 92, 246, 0.45)';
  } else {
    startColor = '#f59e0b';
    stopColor = '#f43f5e';
    glowColor = 'rgba(244, 63, 94, 0.45)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={stopColor} />
            </linearGradient>
            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
              filter: `drop-shadow(0 0 10px ${glowColor})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-baseline">
            {displayScore}
            <span className="text-xl font-medium text-slate-400 ml-0.5">%</span>
          </span>
          {label && (
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 mt-1">
              {label}
            </span>
          )}
        </div>
      </div>

      {sublabel && (
        <span className="text-sm font-medium text-slate-400 mt-3 text-center max-w-[200px]">
          {sublabel}
        </span>
      )}
    </div>
  );
}
