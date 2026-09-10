import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, startOfMonth, subMonths } from 'date-fns'
import { ru } from 'date-fns/locale'

const MonthlyChart = ({ transactions }) => {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(startOfMonth(now), 5 - i)
    return {
      month: format(date, 'LLL', { locale: ru }),
      key: format(date, 'yyyy-MM'),
      income: 0,
      expense: 0,
    }
  })

  transactions.forEach(t => {
    if (!t.date) return
    const key = t.date.substring(0, 7)
    const month = months.find(m => m.key === key)
    if (month) {
      if (t.type === 'income') month.income += t.amount || 0
      else month.expense += t.amount || 0
    }
  })

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} barGap={4}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value, name) => [
              `${value.toLocaleString('ru-RU')} ₽`,
              name === 'income' ? 'Доходы' : 'Расходы'
            ]}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="income" fill="hsl(142, 60%, 45%)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="hsl(0, 72%, 56%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default MonthlyChart
