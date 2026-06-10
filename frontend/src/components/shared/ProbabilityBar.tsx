interface ProbabilityBarProps {
  probability: number;
  label?: string;
}

export default function ProbabilityBar({ probability, label }: ProbabilityBarProps) {
  const color = probability >= 30 ? 'bg-green-500' : probability >= 10 ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div>
      {label && <p className="text-xs text-gray-500 mb-1">{label}</p>}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${color}`}
            style={{ width: `${Math.min(probability, 100)}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700 min-w-[48px] text-right">
          {probability.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
