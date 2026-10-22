import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import { MOCK_AGENTS } from '@/lib/mockData'
import SeoMeta from '@/components/seo/SeoMeta'

const AgentsPage = () => {
  const agents = MOCK_AGENTS

  return (
    <div className="pt-28 pb-20 bg-background min-h-screen" aria-label="Сторінка експертів">
      <SeoMeta
        title="Експерти та ріелтори | Харків Ріелтер"
        description="Наша команда провідних фахівців з нерухомості у Харкові. Професійний підбір житла, юридичний супровід та безпека угод."
        url="/agents"
      />

      <div className="max-w-7xl mx-auto px-6">
        <header className="pb-10 text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter font-semibold">Наша команда</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-bold mb-6 text-foreground tracking-tight">Експерти агентства</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-inter text-sm leading-relaxed">
            Команда професіоналів з багаторічним досвідом роботи на ринку нерухомості Харкова та області
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
                className="group bg-card rounded-2xl border border-border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={agent.photo || '/hero-bg.jpg'}
                    alt={`Фотографія експерта ${agent.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90" aria-hidden="true" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-inter text-2xl font-bold text-white tracking-tight">{agent.name}</h3>
                    <p className="text-white/80 text-[11px] tracking-widest uppercase font-inter mt-1 font-semibold">{agent.role}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow bg-card">
                  {agent.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed font-inter mb-6 line-clamp-3">
                      {agent.bio}
                    </p>
                  )}

                  <div className="flex gap-8 mb-8 mt-auto">
                    {agent.deals_count && (
                      <div aria-label={`${agent.deals_count} угод`}>
                        <p className="font-cormorant font-bold text-3xl text-foreground" aria-hidden="true">{agent.deals_count}</p>
                        <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-inter mt-1" aria-hidden="true">угод</p>
                      </div>
                    )}
                    {agent.experience_years && (
                      <div aria-label={`${agent.experience_years} років досвіду`}>
                        <p className="font-cormorant font-bold text-3xl text-foreground" aria-hidden="true">{agent.experience_years}</p>
                        <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-inter mt-1" aria-hidden="true">років досвіду</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        aria-label={`Зателефонувати ${agent.name}`}
                        className="flex items-center justify-center gap-2 flex-1 py-3 bg-navy text-white text-xs font-inter font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-sm"
                      >
                        <Phone aria-hidden="true" className="w-3.5 h-3.5" /> Зателефонувати
                      </a>
                    )}
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        aria-label={`Написати ${agent.name}`}
                        className="flex items-center justify-center gap-2 flex-1 py-3 border border-border text-xs text-foreground hover:bg-muted transition-colors font-inter rounded-xl font-medium"
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
