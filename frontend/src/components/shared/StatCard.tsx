interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
  description?: string;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-900 border-blue-100',
  green: 'bg-green-50 text-green-900 border-green-100',
  amber: 'bg-amber-50 text-amber-900 border-amber-100',
  purple: 'bg-purple-50 text-purple-900 border-purple-100',
  red: 'bg-red-50 text-red-900 border-red-100',
};

export default function StatCard({ label, value, color = 'blue', description }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {description && <p className="text-xs mt-1 opacity-60">{description}</p>}
    </div>
  );
}
