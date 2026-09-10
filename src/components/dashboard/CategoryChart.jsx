import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_LABELS } from '@/lib/constants'

const COLORS = [
  'hsl(234, 62%, 55%)',
  'hsl(142, 60%, 45%)',
  'hsl(0, 72%, 56%)',
  'hsl(43, 74%, 55%)',
  'hsl(280, 65%, 55%)',
  'hsl(190, 60%, 45%)',
  'hsl(20, 80%, 55%)',
  'hsl(160, 50%, 50%)',
]

const CategoryChart = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense')

  const categoryTotals = {}
  expenses.forEach(t => {
    const cat = t.category || 'other_expense'
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (t.amount || 0)
  })

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name: CATEGORY_LABELS[name] || name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Нет данных о расходах
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-semibold">{item.value.toLocaleString('ru-RU')} ₽</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CategoryChart
