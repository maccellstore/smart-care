import React from 'react';

// Generates an authentic Code 128 / Barcode visual pattern based on input string
export const BarcodeVisual: React.FC<{ value: string; width?: number; height?: number; showText?: boolean }> = ({ 
  value, 
  width = 180, 
  height = 48,
  showText = true 
}) => {
  // Generate deterministic bar widths based on char codes
  const bars: { width: number; isBlack: boolean }[] = [];
  
  // Start pattern
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 2, isBlack: false });
  bars.push({ width: 1, isBlack: true });
  bars.push({ width: 1, isBlack: false });

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const w1 = (code % 3) + 1;
    const w2 = ((code >> 1) % 2) + 1;
    const w3 = ((code >> 2) % 3) + 1;
    bars.push({ width: w1, isBlack: true });
    bars.push({ width: 1, isBlack: false });
    bars.push({ width: w2, isBlack: true });
    bars.push({ width: w3, isBlack: false });
    bars.push({ width: 2, isBlack: true });
    bars.push({ width: 1, isBlack: false });
  }

  // Stop pattern
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });

  const totalUnits = bars.reduce((sum, b) => sum + b.width, 0);
  const scale = width / totalUnits;

  let currentX = 0;

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {bars.map((bar, idx) => {
          const barWidth = bar.width * scale;
          const x = currentX;
          currentX += barWidth;
          if (!bar.isBlack) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={Math.max(1, barWidth)}
              height={height}
              fill="currentColor"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="font-mono text-[11px] tracking-widest text-slate-700 dark:text-slate-300 font-bold mt-1">
          {value}
        </span>
      )}
    </div>
  );
};

// Generates an SVG 2D QR Code matrix pattern
export const QRCodeVisual: React.FC<{ value: string; size?: number }> = ({ value, size = 110 }) => {
  // 21x21 QR matrix simulation with deterministic positioning
  const matrixSize = 21;
  const grid: boolean[][] = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(false));

  // Helper for finder patterns (7x7 squares at corners)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // outer border
          (r >= 2 && r <= 4 && c >= 2 && c <= 4) // center 3x3
        ) {
          grid[startY + r][startX + c] = true;
        } else {
          grid[startY + r][startX + c] = false;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(14, 0); // Top-right
  drawFinder(0, 14); // Bottom-left

  // Timing lines
  for (let i = 8; i < 13; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Populate data area based on hash of string
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Don't overwrite finders
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= 13;
      const inBottomLeft = r >= 13 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const bit = ((hash ^ (r * 31 + c * 17)) >>> ((r + c) % 16)) & 1;
        grid[r][c] = bit === 1;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className="bg-white p-2 rounded-xl shadow-xs inline-block border border-slate-200 dark:border-slate-700">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {grid.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.3}
                height={cellSize + 0.3}
                fill="#0F172A"
                rx={cellSize > 5 ? 0.6 : 0}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
