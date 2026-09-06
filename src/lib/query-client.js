import { QueryClient } from '@tanstack/react-query'

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 1000,
      // Keep data fresh for 10 minutes (reduce unnecessary refetches)
      staleTime: 10 * 60 * 1000,
      // Keep unused cache for 30 minutes (instant back-navigation)
      gcTime: 30 * 60 * 1000,
      // Show stale data while refetching in background
      refetchOnMount: 'always',
    },
  },
})