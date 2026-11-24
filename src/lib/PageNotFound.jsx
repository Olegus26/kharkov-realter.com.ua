import { useLocation, Link } from 'react-router-dom'

const PageNotFound = () => {
  const location = useLocation()
  const pageName = location.pathname.substring(1)

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full border border-border p-8 rounded-2xl bg-card text-center shadow-sm">
        <h1 className="text-7xl font-cormorant font-light text-gold mb-4">404</h1>
        <h2 className="text-2xl font-medium text-foreground mb-4 font-inter">
          Сторінку не знайдено
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 font-inter text-sm">
          Перевірте правильність адреси. Сторінка <span className="text-foreground">&laquo;{pageName}&raquo;</span> не існує.
        </p>

        <Link
          to="/"
          tabIndex={0}
          aria-label="Повернутися на головну сторінку"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm text-foreground hover:text-gold hover:border-gold transition-colors font-inter rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound
