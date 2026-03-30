export default function HpBar({ percent, showText = false }) {
  const pct = Math.max(0, Math.min(100, percent ?? 100));
  const color = pct > 50 ? "#4ADE80" : pct > 20 ? "#FBBF24" : "#F87171";

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <div
          style={{ width: `${pct}%`, backgroundColor: color, transition: "width 0.3s ease-in-out" }}
          className="h-full rounded-full"
        />
      </div>
      {showText && (
        <p className="text-right text-xs font-mono text-gray-500 mt-0.5">{pct}%</p>
      )}
    </div>
  );
}
