import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import { MOCK_AGENTS } from '@/lib/mockData'

const AgentsPage = () => {
  const agents = MOCK_AGENTS

  return (
    <div className="pt-24 pb-20" aria-label="Сторінка експертів">
      <div className="max-w-7xl mx-auto px-6">
        <header className="py-16 text-center border-b border-border mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-inter">Наша команда</p>
          <h1 className="font-cormorant text-6xl sm:text-7xl font-light mb-6 text-foreground">Експерти агентства</h1>
          <p className="text-muted-foreground font-inter max-w-xl mx-auto leading-relaxed">
            Команда професіоналів з багаторічним досвідом роботи на ринку елітної нерухомості
          </p>
        </header>

        {agents.length === 0 ? (
          <div className="text-center py-20" aria-label="Немає експертів">
            <p className="font-cormorant text-3xl text-muted-foreground">Інформація про експертів скоро з'явиться</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                role="listitem"
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                tabIndex={0}
                className="group border border-border bg-card hover:border-gold/40 transition-all duration-500 overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={agent.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={`Фотографія експерта ${agent.name}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-cormorant text-2xl font-medium text-white">{agent.name}</h3>
                    <p className="text-gold text-xs tracking-widest uppercase font-inter mt-1">{agent.role}</p>
                  </div>
                </div>

                <div className="p-6">
                  {agent.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed font-inter mb-5 line-clamp-3">
                      {agent.bio}
                    </p>
                  )}
                  <div className="flex gap-6 mb-5">
                    {agent.deals_count && (
                      <div aria-label={`${agent.deals_count} угод`}>
                        <p className="font-cormorant text-2xl text-gold" aria-hidden="true">{agent.deals_count}</p>
                        <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-inter" aria-hidden="true">угод</p>
                      </div>
                    )}
                    {agent.experience_years && (
                      <div aria-label={`${agent.experience_years} років досвіду`}>
                        <p className="font-cormorant text-2xl text-gold" aria-hidden="true">{agent.experience_years}</p>
                        <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-inter" aria-hidden="true">років досвіду</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-5 border-t border-border">
                    {agent.phone && (
                      <a 
                        href={`tel:${agent.phone}`} 
                        aria-label={`Зателефонувати ${agent.name}`}
                        tabIndex={0}
                        className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-border text-xs text-foreground hover:text-gold hover:border-gold transition-colors font-inter rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <Phone aria-hidden="true" className="w-3.5 h-3.5" /> Зателефонувати
                      </a>
                    )}
                    {agent.email && (
                      <a 
                        href={`mailto:${agent.email}`} 
                        aria-label={`Написати ${agent.name}`}
                        tabIndex={0}
                        className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-border text-xs text-foreground hover:text-gold hover:border-gold transition-colors font-inter rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <Mail aria-hidden="true" className="w-3.5 h-3.5" /> Написати
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentsPage
