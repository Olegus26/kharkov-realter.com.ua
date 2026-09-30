import { useState, useEffect, useCallback } from 'react'

export function useVisited() {
  const [visitedIds, setVisitedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('visited_properties')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const markVisited = useCallback((id) => {
    if (!id) return
    setVisitedIds(prev => {
      const strId = String(id)
      if (prev.includes(strId)) return prev
      const updated = [...prev, strId]
      if (updated.length > 500) updated.shift()
      try {
        localStorage.setItem('visited_properties', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })
  }, [])

  const isVisited = useCallback((id) => {
    return visitedIds.includes(String(id))
  }, [visitedIds])

  return { visitedIds, markVisited, isVisited }
}
