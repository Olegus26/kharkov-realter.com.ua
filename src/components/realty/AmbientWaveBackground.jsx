import { memo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * AmbientWaveBackground
 * A subtle, living ambient wave backdrop that frames the page content from the left and right flanks.
 * Positioned behind all foreground cards and UI (z-0 / pointer-events-none), it reacts to window scrolling
 * with an organic parallax wave flow while continuously breathing with gentle floating motion.
 */
const AmbientWaveBackground = memo(() => {
  const { scrollY } = useScroll()

  // Smooth out scroll delta for buttery parallax wave response
  const smoothScroll = useSpring(scrollY, {
    stiffness: 55,
    damping: 24,
    restDelta: 0.001
  })

  // Parallax transforms responding to page scroll
  const leftPrimaryY = useTransform(smoothScroll, [0, 2500], [0, -170])
  const leftSecondaryY = useTransform(smoothScroll, [0, 2500], [0, 130])
  const leftSkew = useTransform(smoothScroll, [0, 2500], [0, -2])

  const rightPrimaryY = useTransform(smoothScroll, [0, 2500], [0, -140])
  const rightSecondaryY = useTransform(smoothScroll, [0, 2500], [0, 160])
  const rightSkew = useTransform(smoothScroll, [0, 2500], [0, 2])

  const waveScale = useTransform(smoothScroll, [0, 1400, 2800], [1, 1.03, 1])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* LEFT FLANK AMBIENT WAVES */}
      <div className="absolute top-0 bottom-0 left-0 w-48 sm:w-72 md:w-96 lg:w-[480px] xl:w-[560px] 2xl:w-[680px]">
        {/* Soft atmospheric glow base */}
        <motion.div
          style={{ y: leftPrimaryY }}
          className="absolute -top-24 -left-20 w-full h-[125%] bg-gradient-to-r from-navy/[0.09] via-navy/[0.03] to-transparent blur-3xl"
        />

        {/* Primary living wave layer */}
        <motion.div
          style={{ y: leftPrimaryY, skewY: leftSkew, scale: waveScale }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            animate={{
              y: [-12, 12, -12],
              rotate: [-0.4, 0.4, -0.4]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full"
          >
            <svg
              viewBox="0 0 500 1200"
              preserveAspectRatio="none"
              className="w-full h-full opacity-85"
            >
              <defs>
                <linearGradient id="left-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.11" />
                  <stop offset="45%" stopColor="#1e293b" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="left-crest-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Main organic fluid wave body */}
              <path
                d="M0,0 C170,190 230,370 140,580 C60,770 220,970 170,1200 L0,1200 Z"
                fill="url(#left-wave-grad-1)"
              />

              {/* Hairline subtle crest line giving liquid silk ripple contour */}
              <path
                d="M0,0 C170,190 230,370 140,580 C60,770 220,970 170,1200"
                fill="none"
                stroke="url(#left-crest-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Secondary counter-flowing wave ribbon */}
        <motion.div
          style={{ y: leftSecondaryY }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [0.3, -0.3, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full"
          >
            <svg
              viewBox="0 0 500 1200"
              preserveAspectRatio="none"
              className="w-full h-full opacity-65"
            >
              <defs>
                <linearGradient id="left-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 C100,150 190,340 120,530 C70,690 180,890 110,1060 C85,1130 140,1175 95,1200 L0,1200 Z"
                fill="url(#left-wave-grad-2)"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT FLANK AMBIENT WAVES */}
      <div className="absolute top-0 bottom-0 right-0 w-48 sm:w-72 md:w-96 lg:w-[480px] xl:w-[560px] 2xl:w-[680px]">
        {/* Soft atmospheric glow base */}
        <motion.div
          style={{ y: rightPrimaryY }}
          className="absolute -top-24 -right-20 w-full h-[125%] bg-gradient-to-l from-navy/[0.09] via-navy/[0.03] to-transparent blur-3xl"
        />

        {/* Primary living wave layer */}
        <motion.div
          style={{ y: rightPrimaryY, skewY: rightSkew, scale: waveScale }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            animate={{
              y: [12, -12, 12],
              rotate: [0.4, -0.4, 0.4]
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full"
          >
            <svg
              viewBox="0 0 500 1200"
              preserveAspectRatio="none"
              className="w-full h-full opacity-85"
            >
              <defs>
                <linearGradient id="right-wave-grad-1" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.11" />
                  <stop offset="45%" stopColor="#1e293b" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="right-crest-grad" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Main organic fluid wave body */}
              <path
                d="M500,0 C330,190 270,370 360,580 C440,770 280,970 330,1200 L500,1200 Z"
                fill="url(#right-wave-grad-1)"
              />

              {/* Hairline subtle crest line giving liquid silk ripple contour */}
              <path
                d="M500,0 C330,190 270,370 360,580 C440,770 280,970 330,1200"
                fill="none"
                stroke="url(#right-crest-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Secondary counter-flowing wave ribbon */}
        <motion.div
          style={{ y: rightSecondaryY }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-0.3, 0.3, -0.3]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full"
          >
            <svg
              viewBox="0 0 500 1200"
              preserveAspectRatio="none"
              className="w-full h-full opacity-65"
            >
              <defs>
                <linearGradient id="right-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M500,0 C400,150 310,340 380,530 C430,690 320,890 390,1060 C415,1130 360,1175 405,1200 L500,1200 Z"
                fill="url(#right-wave-grad-2)"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Gentle center atmospheric connection so background feels unified and soft */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_25%,transparent_50%,rgba(15,23,42,0.025)_100%)]" />
    </div>
  )
})

export default AmbientWaveBackground
