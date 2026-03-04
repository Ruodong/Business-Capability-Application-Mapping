import { useCallback, useEffect, useState } from 'react'

const DEFAULT_ROUTE = '#/tree-map'

export function useHashRoute(): [string, (hash: string) => void] {
  const [hash, setHash] = useState(() => window.location.hash || DEFAULT_ROUTE)

  useEffect(() => {
    const handler = () => setHash(window.location.hash || DEFAULT_ROUTE)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = useCallback((newHash: string) => {
    window.location.hash = newHash
  }, [])

  return [hash, navigate]
}
