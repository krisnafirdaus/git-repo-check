"use client"

import { useState, useCallback } from "react"
import UserSearch from "@/components/user-search"
import UserList from "@/components/user-list"
import RepositoryList from "@/components/repository-list"
import type { User, Repository } from "@/types"
import { getUserRepositories } from "@/services/github-api"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoadingRepos, setIsLoadingRepos] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleUsersFound = useCallback((foundUsers: User[], query: string) => {
    setUsers(foundUsers)
    setSearchQuery(query)
    // Reset selection when new search results come in
    setSelectedUser(null)
    setRepositories([])
  }, [])

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
  }, [])

  const handleUserSelect = async (user: User) => {
    // If clicking the same user, toggle selection
    if (selectedUser?.id === user.id) {
      setSelectedUser(null)
      setRepositories([])
      return
    }

    setSelectedUser(user)
    setIsLoadingRepos(true)
    setError(null)

    try {
      const repos = await getUserRepositories(user.login)
      setRepositories(repos)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load repositories"
      setError(message)
    } finally {
      setIsLoadingRepos(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">GitHub Repositories Explorer</h1>

      <UserSearch onUsersFound={handleUsersFound} onError={handleError} />

      <UserList users={users} searchQuery={searchQuery} selectedUser={selectedUser} onSelectUser={handleUserSelect} />

      {selectedUser && (
        <RepositoryList repositories={repositories} user={selectedUser} isLoading={isLoadingRepos} error={error} />
      )}
    </main>
  )
}

