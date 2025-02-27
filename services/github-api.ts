import type { User, Repository } from "@/types"

const BASE_URL = "https://api.github.com"

export async function searchUsers(query: string): Promise<User[]> {
  if (!query.trim()) return []

  try {
    const response = await fetch(`${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=5`)

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

export async function getUserRepositories(username: string): Promise<Repository[]> {
  try {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=updated`)

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching repositories:", error)
    throw error
  }
}

