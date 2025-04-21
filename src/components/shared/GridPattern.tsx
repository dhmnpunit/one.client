import React from 'react';

/**
 * Simple Grid background component
 */
export const SimpleGrid = ({ size = 40 }: { size?: number }) => (
  <div
    className="absolute inset-0 z-0 opacity-60"
    style={{
      backgroundImage: "linear-gradient(#d7d7d7 1px, transparent 1px), linear-gradient(to right, #d7d7d7 1px, transparent 1px)",
      backgroundSize: `${size}px ${size}px`
    }}
  />
);

/**
 * Grid component with pattern
 */
export const Grid = ({ pattern, size }: { pattern?: number[][]; size?: number }) => {
  return (
    <div className="absolute inset-0 h-full w-full z-0 opacity-50">
      <GridPattern
        width={size || 40}
        height={size || 40}
        x="50%"
        y="50%"
        squares={pattern || [
          [0, 2],
          [1, 3],
          [2, 0],
          [3, 1],
        ]}
      />
    </div>
  );
};

/**
 * SVG grid pattern component for more complex patterns
 */
export interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  squares?: number[][];
}

export function GridPattern({
  width = 40,
  height = 40,
  x = "0",
  y = "0",
  squares = [[0, 0]],
  ...props
}: GridPatternProps) {
  const patternId = React.useId();
  const points = squares.map(([x, y]) => [
    0.5 + x / 2,
    0.5 + y / 2,
  ]);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M ${height} 0 L 0 0 0 ${width}`}
            className="stroke-gray-300"
            fill="none"
          />
          {points.map(([x, y], i) => (
            <rect
              key={i}
              width="1"
              height="1"
              x={x * width - 0.5}
              y={y * height - 0.5}
              className="fill-gray-300"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
} 