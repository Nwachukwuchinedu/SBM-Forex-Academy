import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  color?: 'gold' | 'emerald';
  ctaText?: string;
  ctaLink?: string;
}

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  features = [],
  color = 'gold',
  ctaText = 'Learn More',
  ctaLink = '#',
}: ServiceCardProps) => {
  const colorClasses = {
    gold: {
      icon: 'text-gold',
      gradient: 'from-gold to-emerald',
      hover: 'hover:border-gold/50',
      shadow: 'shadow-gold/20',
    },
    emerald: {
      icon: 'text-emerald',
      gradient: 'from-emerald to-gold',
      hover: 'hover:border-emerald/50',
      shadow: 'shadow-emerald/20',
    },
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`card-glass border border-gray-700/30 ${colorClasses[color].hover} p-6 rounded-xl flex flex-col h-full`}
    >
      <div className="mb-4 rounded-full bg-gray-200/50 w-14 h-14 flex items-center justify-center">
        <Icon className={`h-7 w-7 ${colorClasses[color].icon}`} />
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-black">{title}</h3>
      <p className="text-gray-900 mb-5">{description}</p>
      
      {features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
              <span className={`inline-block h-5 w-5 rounded-full ${colorClasses[color].icon} text-lg font-bold`}>•</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-auto">
        <a
          href={ctaLink}
          className={`inline-block mt-2 py-2 px-5 rounded-md font-medium text-sm bg-gradient-to-r ${colorClasses[color].gradient} text-white hover:shadow-lg ${colorClasses[color].shadow} transition-all duration-300 transform hover:scale-105`}
        >
          {ctaText}
        </a>
      </div>
    </motion.div>
  );
};

export default ServiceCard;