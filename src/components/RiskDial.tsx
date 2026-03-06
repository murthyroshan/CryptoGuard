import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RiskDialProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RiskDial({ score, size = 'md', className }: RiskDialProps) {
  const radius = size === 'sm' ? 20 : size === 'md' ? 40 : 60;
  const stroke = size === 'sm' ? 4 : size === 'md' ? 8 : 12;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return '#10B981'; // Green
    if (s < 60) return '#F59E0B'; // Yellow
    if (s < 85) return '#EF4444'; // Red
    return '#7F1D1D'; // Dark Red
  };

  const color = getColor(normalizedScore);

  return (
    <div className={twMerge("relative flex items-center justify-center", className)}>
      <svg
        width={(radius + stroke) * 2}
        height={(radius + stroke) * 2}
        className="transform -rotate-90"
      >
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="var(--bg-elevated)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={clsx("font-display font-bold text-white", {
          'text-sm': size === 'sm',
          'text-2xl': size === 'md',
          'text-4xl': size === 'lg',
        })}>
          {score}
        </span>
        {size !== 'sm' && (
          <span className="text-xs text-gray-400 font-mono">RISK</span>
        )}
      </div>
    </div>
  );
}
