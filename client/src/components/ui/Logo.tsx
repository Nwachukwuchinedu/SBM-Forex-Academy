import { TrendingUp } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = 'h-8 w-auto' }: LogoProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-400 rounded-full blur-sm opacity-70"></div>
      <div className="relative bg-white rounded-full p-2 flex items-center justify-center">
        <TrendingUp className="text-gold" />
      </div>
    </div>
  );
};

export default Logo;