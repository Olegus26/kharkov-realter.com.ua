import { useState, useCallback } from 'react'

export const useVisited = () => {
  const [visitedIds, setVisitedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('visited_properties')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const markVisited = useCallback((id) => {
    if (!id) return
    setVisitedIds((prev) => {
      const strId = String(id)
      if (prev.includes(strId)) return prev
      const updated = [...prev, strId]
      if (updated.length > 500) updated.shift()
      try {
        localStorage.setItem('visited_properties', JSON.stringify(updated))
      } catch {
        // Ignore storage write error
      }
      return updated
    })
  }, [])

  const isVisited = useCallback(
    (id) => visitedIds.includes(String(id)),
    [visitedIds]
  )

  return { visitedIds, markVisited, isVisited }
}
