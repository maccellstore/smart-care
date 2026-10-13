import React, { useState } from 'react';

// Area & Line Chart for Revenue Trends
export interface RevenueDataPoint {
  label: string;
  revenue: number;
  jobs: number;
}

export const RevenueAreaChart: React.FC<{
  data: RevenueDataPoint[];
  height?: number;
}> = ({ data, height = 220 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1000);
  const paddingX = 40;
  const paddingY = 24;
  const chartWidth = 540;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (chartWidth - paddingX * 2);
    const y = paddingY + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

  return (
    <div className="w-full overflow-x-auto select-none">
      <div className="relative min-w-[340px]">
        <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + chartHeight * (1 - ratio);
            const val = Math.round(maxRevenue * ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  ₹{(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#revenueGradient)" />

          {/* Smooth line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Points & Hover interactions */}
          {points.map((p, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Vertical guideline */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingY}
                    x2={p.x}
                    y2={paddingY + chartHeight}
                    stroke="#2563EB"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 8 : 4}
                  fill="#2563EB"
                  fillOpacity={isHovered ? 0.25 : 0}
                  className="transition-all duration-200"
                />
                {/* Point center */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#2563EB"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                {/* X axis labels */}
                <text
                  x={p.x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered ? 'fill-blue-600 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoverIndex !== null && (
          <div
            className="absolute -top-3 z-20 pointer-events-none transform -translate-x-1/2 bg-slate-900/95 text-white dark:bg-slate-800/95 px-3 py-1.5 rounded-lg shadow-xl text-xs border border-slate-700/50 backdrop-blur-xs flex flex-col items-center"
            style={{
              left: `${(points[hoverIndex].x / chartWidth) * 100}%`,
              top: `${Math.max(0, points[hoverIndex].y - 45)}px`
            }}
          >
            <span className="text-[10px] text-slate-400 font-medium">{points[hoverIndex].label}</span>
            <span className="font-bold text-emerald-400">₹{points[hoverIndex].revenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-blue-300">{points[hoverIndex].jobs} repairs completed</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Donut Chart for Service Categories
export interface CategoryShare {
  category: string;
  count: number;
  color: string;
}

export const CategoryDonutChart: React.FC<{
  data: CategoryShare[];
  size?: number;
}> = ({ data, size = 180 }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const radius = size / 2 - 16;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, idx) => {
            const fraction = item.count / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeOffset;
            cumulativeOffset += fraction * circumference;

            const isHovered = activeIdx === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {activeIdx !== null ? data[activeIdx].count : total}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {activeIdx !== null ? data[activeIdx].category : 'Total Jobs'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs">
        {data.map((item, idx) => {
          const percent = Math.round((item.count / total) * 100);
          const isSelected = activeIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg cursor-pointer transition ${
                isSelected ? 'bg-slate-100 dark:bg-slate-800 shadow-xs' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
              <span className="font-mono text-slate-400 text-[11px] ml-auto">({percent}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Bar Chart for Technician Performance
export interface TechPerformance {
  name: string;
  completedJobs: number;
  rating: number;
  avatar?: string;
}

export const TechnicianBarChart: React.FC<{
  data: TechPerformance[];
}> = ({ data }) => {
  const maxJobs = Math.max(...data.map(d => d.completedJobs), 1);

  return (
    <div className="space-y-4">
      {data.map((tech, idx) => {
        const percentage = Math.round((tech.completedJobs / maxJobs) * 100);
        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px]">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{tech.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                  ★ {tech.rating.toFixed(1)}
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {tech.completedJobs} repairs
                </span>
              </div>
            </div>
            {/* Bar */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
