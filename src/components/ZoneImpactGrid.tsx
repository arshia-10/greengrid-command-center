import { useState } from "react";
import { GridCell } from "@/lib/digitalTwinEngine";

interface ZoneImpactGridProps {
  grid: GridCell[][];
  onCellHover?: (cell: GridCell | null) => void;
}

const getCellColor = (stress: number): string => {
  if (stress < 25) return "bg-emerald-600"; // Green
  if (stress < 50) return "bg-yellow-500"; // Yellow
  if (stress < 75) return "bg-orange-500"; // Orange
  return "bg-red-600"; // Red
};

const getStressLabel = (stress: number): string => {
  if (stress < 25) return "Healthy";
  if (stress < 50) return "Moderate";
  if (stress < 75) return "Risky";
  return "Critical";
};

export function ZoneImpactGrid({ grid, onCellHover }: ZoneImpactGridProps) {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  const handleCellMouseEnter = (cell: GridCell) => {
    setHoveredCell(cell);
    onCellHover?.(cell);
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
    onCellHover?.(null);
  };

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="relative inline-block bg-background border border-white/10 rounded-lg overflow-hidden p-1">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 12}, minmax(0, 1fr))`,
            width: "100%",
            aspectRatio: "1",
          }}
        >
          {grid.flatMap((row) =>
            row.map((cell) => (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`${getCellColor(cell.stress)} rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-cyan-400 hover:scale-110 relative`}
                onMouseEnter={() => handleCellMouseEnter(cell)}
                onMouseLeave={handleCellMouseLeave}
                title={`Stress: ${cell.stress.toFixed(0)}`}
                style={{
                  opacity: 0.7 + (cell.stress / 100) * 0.3,
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-between items-center px-4 py-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-600" />
            <span className="text-xs text-muted-foreground">Healthy (&lt;25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-xs text-muted-foreground">Moderate (25-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-xs text-muted-foreground">Risky (50-75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600" />
            <span className="text-xs text-muted-foreground">Critical (&gt;75%)</span>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cell ({hoveredCell.x}, {hoveredCell.y})</span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              hoveredCell.stress < 25 ? "bg-emerald-500/20 text-emerald-300" :
              hoveredCell.stress < 50 ? "bg-yellow-500/20 text-yellow-300" :
              hoveredCell.stress < 75 ? "bg-orange-500/20 text-orange-300" :
              "bg-red-500/20 text-red-300"
            }`}>
              {getStressLabel(hoveredCell.stress)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-xs text-muted-foreground">Overall Stress</div>
              <div className="text-lg font-bold font-mono-data">{hoveredCell.stress.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">AQI</div>
              <div className="text-lg font-bold font-mono-data">{hoveredCell.aqi.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Temperature</div>
              <div className="text-lg font-bold font-mono-data">{hoveredCell.temperature.toFixed(1)}°C</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="text-lg font-bold font-mono-data">{hoveredCell.humidity.toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Industrial Load</div>
              <div className="text-lg font-bold font-mono-data">{(hoveredCell.industrialLoad * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Waste Risk</div>
              <div className="text-lg font-bold font-mono-data">{(hoveredCell.wasteRisk * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
