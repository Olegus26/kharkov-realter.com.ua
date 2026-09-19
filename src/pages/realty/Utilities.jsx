import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import UtilityCard from '@/components/realty/UtilityCard';
import { utilities } from '@/lib/utilityData';

export default function UtilitiesPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12 border-b border-border mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-inter">Довідник</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light mb-3">Комунальні служби Харкова</h1>
          <p className="text-muted-foreground text-sm font-inter max-w-2xl leading-relaxed">
            Корисні контакти комунальних та адміністративних служб для мешканців Харкова.
            Збережіть посилання на цю сторінку — всі контакти під рукою.
          </p>
        </div>

        {/* Emergency banner */}
        <div className="bg-[#111827] rounded-xl p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-red-500/90 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white text-2xl font-medium mb-1">Аварійна газова служба</p>
            <p className="text-slate-400 text-sm font-inter">
              При запаху газу або аварійній ситуації — телефонуйте негайно, цілодобово
            </p>
          </div>
          
          <a href="tel:104"
            className="px-10 py-4 bg-white text-[#111827] rounded-full font-inter text-2xl font-semibold tracking-wide hover:bg-gray-100 transition-colors shrink-0">
            104
          </a>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((util, i) => (
            <motion.div
              key={util.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: Math.min(i * 0.1, 0.4), duration: 0.6 }}
              className="h-full"
            >
              <UtilityCard utility={util} />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 p-8 rounded-2xl border border-border bg-secondary/30 text-center">
          <p className="text-sm text-muted-foreground font-inter max-w-2xl mx-auto leading-relaxed">
            У період дії воєнного стану графік роботи центрів обслуговування може змінюватись
            залежно від безпекової ситуації. Рекомендуємо попередньо телефонувати перед візитом.
          </p>
        </div>
      </div>
    </div>
  );
}
