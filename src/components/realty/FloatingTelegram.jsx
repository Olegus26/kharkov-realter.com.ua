import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingTelegram() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      ref={containerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Menu items */}
      <div 
        className={cn(
          "absolute bottom-full right-0 mb-3 flex flex-col items-end gap-3 transition-all duration-300 origin-bottom",
          open ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-90 pointer-events-none translate-y-4"
        )}
      >
        <a 
          href="https://t.me/kharkov_realter" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-[0_8px_20px_rgba(0,136,204,0.15)] border border-border/50 hover:bg-slate-50 hover:-translate-y-0.5 transition-all group"
        >
          <span className="text-sm font-semibold text-foreground">Канал</span>
          <div className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
            <Rss className="w-4 h-4" />
          </div>
        </a>
        <a 
          href="https://t.me/kharkovrealter_bot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-[0_8px_20px_rgba(0,136,204,0.15)] border border-border/50 hover:bg-slate-50 hover:-translate-y-0.5 transition-all group"
        >
          <span className="text-sm font-semibold text-foreground">Бот</span>
          <div className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
          </div>
        </a>
      </div>

      {/* Main button with radar waves */}
      <div className="relative">
        {/* Radar ring */}
        <div className="absolute inset-0 border-2 border-[#0088cc] rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75" />
        
        <button 
          onClick={() => setOpen(!open)}
          className="relative w-14 h-14 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,136,204,0.35)] hover:bg-[#0077b3] transition-all hover:shadow-[0_12px_25px_rgba(0,136,204,0.45)] duration-300"
          aria-label="Telegram"
        >
        {/* Exact Telegram SVG */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white -ml-1 mt-0.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.939 4.093c-.45-.19-1.285-.052-1.285-.052L4.015 9.774s-.73.305-.71.854c.018.55.698.818.698.818l3.963 1.34s.885 2.766 1.054 3.255c.17.488.423.456.63.266.206-.19 1.545-1.464 1.545-1.464l3.774 2.87s.63.414 1.25.263c.62-.15.74-.847.74-.847l2.87-12.285s.12-.76-.89-1.15zM7.886 11.458l8.347-5.11s.445-.25.32-.016c-.125.234-6.425 6.068-6.425 6.068s-.3.304-.26.69c.04.385.205 1.564.205 1.564l-1.39-2.228 1.135-2.072z" />
        </svg>
      </button>
      </div>
    </div>
  );
}
