import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter = ({ 
  value, 
  duration = 2000,
  suffix = ''
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * value);
      countRef.current = currentCount;
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, inView]);

  const formattedCount = count.toLocaleString();
  
  return <span ref={ref}>{formattedCount}{suffix}</span>;
};

export default AnimatedCounter;