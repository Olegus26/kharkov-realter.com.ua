import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import { MOCK_AGENTS } from '@/lib/mockData'

const AgentsPage = () => {
  const agents = MOCK_AGENTS

  return (
    <div className="pt-28 pb-20 bg-background min-h-screen" aria-label="Сторінка експертів">
      <div className="max-w-7xl mx-auto px-6">
        <header className="pb-10 text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4 font-inter">Наша команда</p>
          <h1 className="font-inter text-5xl sm:text-6xl font-light mb-6 text-foreground tracking-tight">Експерти агентства</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-inter text-sm">
            Команда професіоналів з багаторічним досвідом роботи на ринку елітної нерухомості
          </p>
        </header>

        {agents.length === 0 ? (
          <div className="text-center py-20" aria-label="Немає експертів">
            <p className="font-inter text-2xl text-muted-foreground">Інформація про експертів скоро з'явиться</p>
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
                className="group bg-card transition-all duration-500 overflow-hidden flex flex-col focus:outline-none border border-transparent hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={agent.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={`Фотографія експерта ${agent.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  {/* Blue gradient over image (flush with edges) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90" aria-hidden="true" />
                  
                  {/* Name overlaid on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-inter text-2xl font-medium text-white tracking-tight">{agent.name}</h3>
                    <p className="text-white/60 text-[10px] tracking-widest uppercase font-inter mt-1">{agent.role}</p>
                  </div>
                </div>

                {/* White bottom section */}
                <div className="p-6 flex flex-col flex-grow bg-card">
                  {agent.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed font-inter mb-6 line-clamp-3">
                      {agent.bio}
                    </p>
                  )}
                  
                  <div className="flex gap-8 mb-8 mt-auto">
                    {agent.deals_count && (
                      <div aria-label={`${agent.deals_count} угод`}>
                        <p className="font-inter text-2xl text-foreground font-light" aria-hidden="true">{agent.deals_count}</p>
                        <p className="text-[9px] text-muted-foreground tracking-widest uppercase font-inter mt-1" aria-hidden="true">угод</p>
                      </div>
                    )}
                    {agent.experience_years && (
                      <div aria-label={`${agent.experience_years} років досвіду`}>
                        <p className="font-inter text-2xl text-foreground font-light" aria-hidden="true">{agent.experience_years}</p>
                        <p className="text-[9px] text-muted-foreground tracking-widest uppercase font-inter mt-1" aria-hidden="true">років досвіду</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 pt-6 border-t border-border">
                    {agent.phone && (
                      <a 
                        href={`tel:${agent.phone}`} 
                        aria-label={`Зателефонувати ${agent.name}`}
                        tabIndex={0}
                        className="flex items-center justify-center gap-2 flex-1 py-3 border border-border text-xs text-foreground hover:bg-muted transition-colors font-inter focus:outline-none"
                      >
                        <Phone aria-hidden="true" className="w-3.5 h-3.5 text-muted-foreground" /> Зателефонувати
                      </a>
                    )}
                    {agent.email && (
                      <a 
                        href={`mailto:${agent.email}`} 
                        aria-label={`Написати ${agent.name}`}
                        tabIndex={0}
                        className="flex items-center justify-center gap-2 flex-1 py-3 border border-border text-xs text-foreground hover:bg-muted transition-colors font-inter focus:outline-none"
                      >
                        <Mail aria-hidden="true" className="w-3.5 h-3.5 text-muted-foreground" /> Написати
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
