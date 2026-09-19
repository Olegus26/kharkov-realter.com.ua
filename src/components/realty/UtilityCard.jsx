import { useState } from 'react';
import {
  Zap, Flame, Droplet, Trash2, Recycle, Landmark, Building2, Fuel,
  Phone, Mail, MapPin, Clock, Globe, ChevronDown,
} from 'lucide-react';
import { telHref } from '@/lib/utilityData';

const ICONS = { Zap, Flame, Droplet, Trash2, Recycle, Landmark, Building2, Fuel };

const getIconStyle = (iconName) => {
  switch (iconName) {
    case 'Zap': return { bg: 'bg-amber-50', icon: 'text-amber-500 fill-yellow-400' };
    case 'Flame': return { bg: 'bg-orange-50', icon: 'text-orange-500 fill-yellow-400' };
    case 'Droplet': return { bg: 'bg-blue-50', icon: 'text-blue-500 fill-cyan-300' };
    case 'Trash2': return { bg: 'bg-stone-100', icon: 'text-stone-500 fill-stone-300' };
    case 'Recycle': return { bg: 'bg-emerald-50', icon: 'text-emerald-500 fill-green-300' };
    case 'Landmark': return { bg: 'bg-indigo-50', icon: 'text-indigo-500 fill-blue-300' };
    case 'Building2': return { bg: 'bg-violet-50', icon: 'text-violet-500 fill-fuchsia-300' };
    case 'Fuel': return { bg: 'bg-rose-50', icon: 'text-rose-500 fill-orange-300' };
    default: return { bg: 'bg-gold/10', icon: 'text-gold fill-gold/30' };
  }
};

export default function UtilityCard({ utility }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[utility.icon] || Building2;
  const style = getIconStyle(utility.icon);

  return (
    <div className="bg-card border border-border hover:border-gold/40 transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1">
        {/* Number + icon */}
        <div className="flex items-start justify-between mb-5">
          <span className="font-cormorant text-4xl text-gold/25">{utility.num}</span>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}>
            <Icon className={`w-5 h-5 ${style.icon}`} />
          </div>
        </div>

        <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2 font-inter">{utility.category}</p>
        <h3 className="font-cormorant text-xl mb-2 leading-snug">{utility.name}</h3>
        {utility.description && (
          <p className="text-muted-foreground text-sm mb-5 font-inter leading-relaxed">{utility.description}</p>
        )}

        {/* Phones */}
        <div className="space-y-2 mb-4">
          {utility.phones?.map((phone, i) => (
            <a key={i} href={telHref(phone.number)}
              className="flex items-center gap-2 text-sm group">
              <Phone className="w-3.5 h-3.5 text-gold/60 shrink-0" />
              <span className="font-inter">
                {phone.label && <span className="text-muted-foreground text-xs mr-1">{phone.label}:</span>}
                <span className="text-foreground group-hover:text-gold transition-colors">{phone.number}</span>
                {phone.emergency && <span className="text-[10px] text-muted-foreground ml-1">(цілодобово)</span>}
              </span>
            </a>
          ))}
        </div>

        {/* Email + Website */}
        {(utility.email || utility.website) && (
          <div className="flex gap-4 mb-4">
            {utility.email && (
              <a href={`mailto:${utility.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors font-inter">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}
            {utility.website && (
              <a href={utility.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors font-inter">
                <Globe className="w-3.5 h-3.5" /> Сайт
              </a>
            )}
          </div>
        )}

        {/* Address */}
        {utility.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 text-gold/60 shrink-0 mt-0.5" />
            <span className="font-inter">{utility.address}</span>
          </div>
        )}

        {/* Schedule */}
        {utility.schedule && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-3.5 h-3.5 text-gold/60 shrink-0 mt-0.5" />
            <span className="font-inter">{utility.schedule}</span>
          </div>
        )}

        {/* Note */}
        {utility.note && (
          <p className="text-xs text-muted-foreground/80 italic font-inter mt-3 leading-relaxed">
            {utility.note}
          </p>
        )}

        {/* Services list */}
        {utility.services?.length > 0 && (
          <div className="mt-4 mb-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/60 mb-2 font-inter">Звертатися з питань:</p>
            <ul className="space-y-1">
              {utility.services.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground font-inter flex items-start gap-1.5">
                  <span className="text-gold/40 mt-0.5">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* District offices accordion */}
      {utility.districts?.length > 0 && (
        <div className="border-t border-border p-6 pt-4 mt-auto">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full text-xs uppercase tracking-widest text-gold font-inter hover:text-gold-light transition-colors"
          >
            Районні відділення ({utility.districts.length})
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="mt-4 space-y-4">
              {utility.districts.map(d => (
                <div key={d.name} className="text-sm border-l-2 border-gold/30 pl-3">
                  <p className="font-medium text-foreground font-inter">{d.name}</p>
                  {d.address && <p className="text-muted-foreground text-xs font-inter">{d.address}</p>}
                  {d.phones?.map((phone, i) => (
                    <a key={i} href={telHref(phone.number)} className="flex items-center gap-2 text-xs mt-1 group">
                      <Phone className="w-3 h-3 text-gold/60 shrink-0" />
                      {phone.label && <span className="text-muted-foreground">{phone.label}:</span>}
                      <span className="group-hover:text-gold transition-colors">{phone.number}</span>
                      {phone.emergency && <span className="text-muted-foreground text-[10px] ml-1">(цілодобово)</span>}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
