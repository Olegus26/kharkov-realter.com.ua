import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard from '@/components/realty/PropertyCard'
import { getAllObjects, mapObject } from '@/lib/novostoyApi'
import { useFavorites } from '@/lib/FavoritesContext'

const FavoritesPage = () => {
  const { favorites } = useFavorites()

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['novostoy-objects', '', ''], 
    queryFn: async () => {
      const allItems = await getAllObjects({})
      return allItems.map(mapObject)
    },
    staleTime: 5 * 60 * 1000,
  })

  const favoriteProperties = allProperties.filter(p => favorites.includes(p.id))

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-inter mb-2">ОБРАНЕ</p>
            <h1 className="font-inter font-bold text-4xl sm:text-5xl tracking-tight text-foreground">Збережені об'єкти</h1>
          </div>
          <p className="text-sm text-muted-foreground font-inter">{favorites.length} об'єктів</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border h-[400px] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 bg-card rounded-3xl shadow-sm border border-border">
            <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center mb-6 text-muted-foreground">
              <Heart className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <p className="font-inter font-medium text-2xl text-foreground mb-2">Поки немає збережених об'єктів</p>
            <p className="text-muted-foreground font-inter mb-8 text-sm">Натисніть на серце біля об'єкта, щоб зберегти його тут</p>
            <Link to="/flats" className="px-8 py-4 gradient-gold text-xs tracking-widest uppercase font-inter font-semibold rounded-full hover:opacity-90 transition-opacity shadow-md flex items-center gap-2">
              Перейти до каталогу <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
