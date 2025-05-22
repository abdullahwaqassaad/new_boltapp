import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  description?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'secondary';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  description,
  color = 'primary'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'success': return 'bg-success-50 border-success-200 text-success-700';
      case 'warning': return 'bg-warning-50 border-warning-200 text-warning-700';
      case 'danger': return 'bg-danger-50 border-danger-200 text-danger-700';
      case 'accent': return 'bg-accent-50 border-accent-200 text-accent-700';
      case 'secondary': return 'bg-secondary-50 border-secondary-200 text-secondary-700';
      default: return 'bg-primary-50 border-primary-200 text-primary-700';
    }
  };
  
  const getIconClass = () => {
    switch (color) {
      case 'success': return 'bg-success-100 text-success-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      case 'danger': return 'bg-danger-100 text-danger-600';
      case 'accent': return 'bg-accent-100 text-accent-600';
      case 'secondary': return 'bg-secondary-100 text-secondary-600';
      default: return 'bg-primary-100 text-primary-600';
    }
  };
  
  const getChangeClass = () => {
    if (!change) return '';
    return change > 0 ? 'text-success-600' : 'text-danger-600';
  };

  return (
    <div className={`rounded-lg border ${getColorClass()} overflow-hidden`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {description && <p className="mt-1 text-xs opacity-80">{description}</p>}
          </div>
          <div className={`rounded-md p-3 ${getIconClass()}`}>
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4">
            <span className={`text-sm font-medium ${getChangeClass()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs ml-1 opacity-70">compared to traditional diagnosis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;