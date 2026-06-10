import { Coins } from 'lucide-react';

interface Props { points: number; size?: 'sm' | 'md' | 'lg' }

export function PointsBadge({ points, size = 'md' }: Props) {
  const sizes = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-1.5', lg: 'text-base px-4 py-2' };
  return (
    <span className={`inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold rounded-full ${sizes[size]}`}>
      <Coins size={size === 'lg' ? 18 : 14} />
      {points.toLocaleString('pt-BR')} pts
    </span>
  );
}
