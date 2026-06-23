import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, className, iconClassName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl p-5 sm:p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className="text-xs font-medium opacity-60">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconClassName)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}