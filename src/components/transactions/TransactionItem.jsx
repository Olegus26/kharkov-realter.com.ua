import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';

export default function TransactionItem({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income';
  const IconComponent = CATEGORY_ICONS[transaction.category];

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors group">
      <div className={cn(
        "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0",
        isIncome ? "bg-chart-1/10 text-chart-1" : "bg-chart-2/10 text-chart-2"
      )}>
        {IconComponent && <IconComponent className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.title}</p>
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABELS[transaction.category] || transaction.category}
          {transaction.date && ` · ${format(new Date(transaction.date), 'd MMM', { locale: ru })}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className={cn(
          "font-semibold text-sm tabular-nums",
          isIncome ? "text-chart-1" : "text-chart-2"
        )}>
          {isIncome ? '+' : '−'}{transaction.amount?.toLocaleString('ru-RU')} ₽
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(transaction); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}