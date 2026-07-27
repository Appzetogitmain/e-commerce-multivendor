import { ReactNode } from 'react';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  accentColor: string;
  onClick?: () => void;
}

export default function DashboardCard({ icon, title, value, accentColor, onClick }: DashboardCardProps) {
  const isClickable = !!onClick;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-neutral-100 p-3 sm:p-3.5 transition-all select-none
        ${isClickable 
          ? 'cursor-pointer hover:shadow-md hover:border-neutral-200 active:scale-[0.98]' 
          : 'shadow-sm'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
          <div style={{ color: accentColor }} className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
        </div>
      </div>
      <h3 className="text-neutral-500 text-[11px] sm:text-xs font-semibold mb-0.5 tracking-tight">{title}</h3>
      <p className="text-lg sm:text-xl font-extrabold text-neutral-800">{value}</p>
    </div>
  );
}

