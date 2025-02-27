"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchUsers } from "@/services/github-api"
import type { User } from "@/types"
import LoadingSpinner from "@/components/loading-spinner"
import ErrorMessage from "@/components/error-message"

interface UserSearchProps {
  onUsersFound: (users: User[], query: string) => void
  onError: (error: string) => void
}

export default function UserSearch({ onUsersFound, onError }: UserSearchProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        onUsersFound([], "")
        return
      }

      setIsLoading(true)
      try {
        const users = await searchUsers(debouncedQuery)
        onUsersFound(users, debouncedQuery)
        setErrorMessage("")
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred"
        setErrorMessage(message)
        onError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [debouncedQuery, onUsersFound, onError])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // The search is already triggered by the debounced query effect
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 border rounded p-2"
            placeholder="Enter GitHub username"
            value={query}
            onChange={handleInputChange}
            aria-label="Search for GitHub users"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {isLoading && <LoadingSpinner size="small" />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
}

