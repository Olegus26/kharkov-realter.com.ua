import { useEffect, useRef } from 'react'

const AmbientSideWaves = () => {
  const leftTopRef = useRef(null)
  const leftBottomRef = useRef(null)
  const rightTopRef = useRef(null)
  const rightBottomRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReducedMotion) return

    let frameId = null

    const updateTransforms = () => {
      frameId = null
      const y = window.scrollY || 0
      const waveA = Math.sin(y * 0.0022)
      const waveB = Math.cos(y * 0.0018)

      if (leftTopRef.current) {
        leftTopRef.current.style.transform = `translate3d(${(waveA * 24).toFixed(1)}px, ${(waveB * 36).toFixed(1)}px, 0) rotate(${(waveA * 6).toFixed(2)}deg)`
      }
      if (leftBottomRef.current) {
        leftBottomRef.current.style.transform = `translate3d(${(-waveB * 20).toFixed(1)}px, ${(waveA * 42).toFixed(1)}px, 0)`
      }
      if (rightTopRef.current) {
        rightTopRef.current.style.transform = `translate3d(${(-waveA * 26).toFixed(1)}px, ${(-waveB * 34).toFixed(1)}px, 0) rotate(${(-waveA * 6).toFixed(2)}deg)`
      }
      if (rightBottomRef.current) {
        rightBottomRef.current.style.transform = `translate3d(${(waveB * 22).toFixed(1)}px, ${(-waveA * 40).toFixed(1)}px, 0)`
      }
    }

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(updateTransforms)
    }

    updateTransforms()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Left side flowing wave glow */}
      <div
        ref={leftTopRef}
        className="absolute top-[10%] -left-[180px] xl:-left-[120px] w-[360px] h-[480px] rounded-[46%_54%_62%_38%/44%_56%_44%_56%] bg-gradient-to-br from-navy/[0.08] via-sky-500/[0.11] to-transparent blur-[88px] will-change-transform"
      />
      <div
        ref={leftBottomRef}
        className="absolute bottom-[6%] -left-[170px] xl:-left-[110px] w-[320px] h-[420px] rounded-[58%_42%_48%_52%/52%_38%_62%_48%] bg-gradient-to-tr from-sky-400/[0.10] via-navy/[0.06] to-transparent blur-[92px] will-change-transform"
      />

      {/* Right side flowing wave glow */}
      <div
        ref={rightTopRef}
        className="absolute top-[16%] -right-[180px] xl:-right-[120px] w-[360px] h-[460px] rounded-[54%_46%_38%_62%/56%_44%_56%_44%] bg-gradient-to-bl from-sky-500/[0.11] via-navy/[0.075] to-transparent blur-[88px] will-change-transform"
      />
      <div
        ref={rightBottomRef}
        className="absolute bottom-[8%] -right-[170px] xl:-right-[110px] w-[320px] h-[420px] rounded-[42%_58%_52%_48%/38%_52%_48%_62%] bg-gradient-to-tl from-navy/[0.075] via-sky-400/[0.08] to-amber-300/[0.05] blur-[92px] will-change-transform"
      />
    </div>
  )
}

export default AmbientSideWaves
