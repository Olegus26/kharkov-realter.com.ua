import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const FavoritesContext = createContext(null)
const FAVORITES_KEY = 'kharkov-realter-favorites'
const FAVORITES_ITEMS_KEY = 'kharkov-realter-favorites-items'

const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    return JSON.parse(stored)
  } catch {
    return fallback
  }
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []))
  const [favoriteItems, setFavoriteItems] = useState(() => readStorage(FAVORITES_ITEMS_KEY, {}))

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // Storage unavailable or full
    }
  }, [favorites])

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_ITEMS_KEY, JSON.stringify(favoriteItems))
    } catch {
      // Storage unavailable or full
    }
  }, [favoriteItems])

  const toggleFavorite = useCallback((id, propertyData = null) => {
    if (!id) return
    const stringId = String(id)

    setFavorites((prev) => {
      const isSaved = prev.includes(stringId)
      if (isSaved) {
        setFavoriteItems((prevItems) => {
          if (!prevItems[stringId]) return prevItems
          const nextItems = { ...prevItems }
          delete nextItems[stringId]
          return nextItems
        })
        return prev.filter((favId) => favId !== stringId)
      }

      if (propertyData) {
        setFavoriteItems((prevItems) => ({
          ...prevItems,
          [stringId]: propertyData,
        }))
      }
      return [...prev, stringId]
    })
  }, [])

  const saveFavoriteItem = useCallback((propertyData) => {
    if (!propertyData?.id) return
    const stringId = String(propertyData.id)

    setFavoriteItems((prevItems) => {
      if (prevItems[stringId]) return prevItems
      return {
        ...prevItems,
        [stringId]: propertyData,
      }
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    if (!id) return
    const stringId = String(id)

    setFavorites((prev) => prev.filter((favId) => favId !== stringId))
    setFavoriteItems((prevItems) => {
      if (!prevItems[stringId]) return prevItems
      const nextItems = { ...prevItems }
      delete nextItems[stringId]
      return nextItems
    })
  }, [])

  const isFavorite = useCallback((id) => {
    if (!id) return false
    return favorites.includes(String(id))
  }, [favorites])

  const value = useMemo(
    () => ({
      favorites,
      favoriteItems,
      toggleFavorite,
      saveFavoriteItem,
      removeFavorite,
      isFavorite,
    }),
    [favorites, favoriteItems, toggleFavorite, saveFavoriteItem, removeFavorite, isFavorite]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
