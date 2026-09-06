import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/realty/PropertyCard';
import { getAllObjects, mapObject } from '@/lib/novostoyApi';
import { useFavorites } from '@/lib/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['novostoy-objects', '', ''], 
    queryFn: async () => {
      const allItems = await getAllObjects({});
      return allItems.map(mapObject);
    },
    staleTime: 5 * 60 * 1000,
  });

  const favoriteProperties = allProperties.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-gold fill-gold" />
          </div>
          <h1 className="font-cormorant text-5xl mb-4">Обрані об'єкти</h1>
          <p className="text-muted-foreground font-inter">
            Збережені варіанти нерухомості для швидкого доступу
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border h-[400px] animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 border border-border/50 bg-card">
            <p className="text-muted-foreground font-inter mb-4">У вас поки немає збережених об'єктів</p>
            <Link to="/flats" className="text-gold hover:underline font-inter text-sm tracking-widest uppercase">
              Перейти до каталогу
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
  );
}
