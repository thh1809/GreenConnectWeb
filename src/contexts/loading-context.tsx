"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string
  startLoading: (message?: string) => void
  stopLoading: () => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Đang tải...")

  const startLoading = useCallback((message?: string) => {
    if (message) {
      setLoadingMessage(message)
    }
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const updateMessage = useCallback((message: string) => {
    setLoadingMessage(message)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        setLoadingMessage: updateMessage,
      }}
    >
      {children}
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

