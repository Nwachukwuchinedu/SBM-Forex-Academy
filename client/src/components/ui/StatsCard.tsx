import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface StatsCardProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: ReactNode;
  color?: 'gold' | 'emerald';
}

const StatsCard = ({
  value,
  label,
  suffix = '',
  icon,
  color = 'gold',
}: StatsCardProps) => {
  const colorClasses = {
    gold: {
      text: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/20',
    },
    emerald: {
      text: 'text-emerald',
      bg: 'bg-emerald/10',
      border: 'border-emerald/20',
    },
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card-neumorphic p-6 ${colorClasses[color].bg} border ${colorClasses[color].border}`}
    >
      {icon && <div className="mb-3">{icon}</div>}
      <div className={`text-3xl md:text-4xl font-bold mb-2 ${colorClasses[color].text}`}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
};

export default StatsCard;