import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AddressRevolver({ addresses, onChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isWheeling = useRef(false);
  const wheelTimeout = useRef(null);

  useEffect(() => {
    if (onChange && addresses && addresses.length > 0) {
      onChange(activeIndex);
    }
  }, [activeIndex, addresses, onChange]);

  if (!addresses || addresses.length === 0) return null;

  if (addresses.length === 1) {
    return (
      <div className="flex gap-3 w-full">
        <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
        <div className="flex flex-col text-muted-foreground w-full">
          <span className="font-semibold text-sm leading-tight">{addresses[0].title}</span>
          <span className="text-[13px] leading-tight truncate">{addresses[0].addr}</span>
        </div>
      </div>
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
        setActiveIndex((prev) => Math.min(prev + 1, addresses.length - 1));
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
  }, [addresses.length]);
  
  return (
    <div 
      ref={containerRef}
      className="flex gap-3 relative h-[80px] w-full" 
      title="Гортайте коліщатком миші"
    >
      <MapPin className="w-4 h-4 text-gold mt-[32px] shrink-0 z-10" />
      
      <div 
        className="flex flex-col h-[80px] overflow-hidden relative perspective-[1000px] w-full"
        style={{ padding: '20px 0' }}
      >
        <div 
           className="transition-transform duration-300 ease-out flex flex-col"
           style={{ transform: `translateY(-${activeIndex * 40}px)` }}
        >
          {addresses.map((a, idx) => {
            const diff = idx - activeIndex;
            const isActive = diff === 0;
            
            return (
              <div 
                key={idx} 
                className="flex-none h-[40px] flex items-center justify-start transition-all duration-300 ease-out origin-left"
                style={{
                  transform: `rotateX(${diff * -40}deg) scale(${isActive ? 1 : 0.85}) translateZ(${isActive ? '0px' : '-10px'})`,
                  opacity: isActive ? 1 : 0.4,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <div className={cn("flex flex-col w-full transition-colors", isActive ? "text-muted-foreground" : "text-muted-foreground/50")}>
                  <span className="font-semibold text-sm leading-tight">{a.title}</span>
                  <span className="text-[13px] leading-tight truncate">{a.addr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
