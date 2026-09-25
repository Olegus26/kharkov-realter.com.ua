import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { getPhoneLink } from '@/lib/phones';
import { cn } from '@/lib/utils';

export default function PhoneRevolver({ phones }) {
  const [activeIndex, setActiveIndex] = useState(phones?.length >= 3 ? 1 : 0);
  const isWheeling = useRef(false);
  const wheelTimeout = useRef(null);

  if (!phones || phones.length === 0) return null;

  if (phones.length === 1) {
    return (
      <a href={getPhoneLink(phones[0])} className="hidden xl:flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-gold transition-colors">
        <Phone className="w-4 h-4" />
        {phones[0]}
      </a>
    );
  }

  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e) => {
      e.preventDefault(); // Blocks the whole page from scrolling
      
      if (isWheeling.current) return;
      
      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, phones.length - 1));
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      
      isWheeling.current = true;
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        isWheeling.current = false;
      }, 150);
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [phones.length]);
  
  return (
    <div 
      ref={containerRef}
      className="hidden xl:flex items-center gap-2 relative h-[50px]" 
      title="Гортайте коліщатком миші"
    >
      <Phone className="w-4 h-4 text-foreground/60 z-10 shrink-0" />
      
      <div 
        className="flex flex-col h-[50px] overflow-hidden relative perspective-[1000px] w-[140px]"
        style={{ padding: '13px 0' }}
      >
        <div 
           className="transition-transform duration-300 ease-out flex flex-col"
           style={{ transform: `translateY(-${activeIndex * 24}px)` }}
        >
          {phones.map((p, idx) => {
            const diff = idx - activeIndex;
            const isActive = diff === 0;
            
            return (
              <a 
                key={idx} 
                href={getPhoneLink(p)} 
                className="flex-none h-[24px] flex items-center justify-start transition-all duration-300 ease-out origin-center"
                style={{
                  transform: `rotateX(${diff * -40}deg) scale(${isActive ? 1 : 0.85}) translateZ(${isActive ? '0px' : '-10px'})`,
                  opacity: isActive ? 1 : 0.4,
                  color: isActive ? 'inherit' : 'hsl(var(--foreground) / 0.6)',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <span className={cn("text-sm font-medium truncate transition-colors", isActive ? "text-foreground/80 hover:text-gold" : "")}>
                  {p}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
