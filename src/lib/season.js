import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const SEASONS = ['winter', 'spring', 'summer', 'autumn']

export const getSeasonByMonth = (month) => {
  if (month === 11 || month === 0 || month === 1) {
    return 'winter'
  }
  if (month >= 2 && month <= 4) {
    return 'spring'
  }
  if (month >= 5 && month <= 7) {
    return 'summer'
  }
  return 'autumn'
}

export const getCurrentSeason = (
  search = typeof window !== 'undefined' ? window.location.search : '',
  date = new Date()
) => {
  const param = new URLSearchParams(search).get('season')?.toLowerCase()
  if (param && SEASONS.includes(param)) {
    return param
  }
  return getSeasonByMonth(date.getMonth())
}

export const getSeasonalAssets = (season = getCurrentSeason()) => {
  const safeSeason = SEASONS.includes(season) ? season : 'autumn'
  const isWinter = safeSeason === 'winter'

  return {
    season: safeSeason,
    isWinter,
    logo: isWinter ? '/images/brand/logo-winter.png' : '/images/brand/logo.png',
    heroDesktop: `/images/backgrounds/hero-${safeSeason}.webp`,
    heroMobile: `/images/backgrounds/hero-${safeSeason}-mobile.webp`,
    aboutDesktop: `/images/backgrounds/about-${safeSeason}.webp`,
    aboutMobile: `/images/backgrounds/about-${safeSeason}-mobile.webp`,
  }
}

export const useSeasonalAssets = () => {
  const { search } = useLocation()
  return useMemo(() => getSeasonalAssets(getCurrentSeason(search)), [search])
}
