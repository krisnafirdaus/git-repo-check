import type { Repository, User } from "@/types"
import LoadingSpinner from "@/components/loading-spinner"
import ErrorMessage from "@/components/error-message"
import { ChevronUp, Star } from "lucide-react"

interface RepositoryListProps {
  repositories: Repository[]
  user: User | null
  isLoading: boolean
  error: string | null
}

export default function RepositoryList({ repositories, user, isLoading, error }: RepositoryListProps) {
  if (!user) return null
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{user.login}'s repositories</h2>
        <div className="flex items-center">
          <img
            src={user.avatar_url || "/placeholder.svg"}
            alt={`${user.login}'s avatar`}
            className="w-10 h-10 rounded-full mr-2"
          />
          <ChevronUp className="h-5 w-5" />
        </div>
      </div>

      {repositories.length === 0 ? (
        <p>No repositories found</p>
      ) : (
        <div className="space-y-4">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {repo.name}
                  </a>
                </h3>
                <div className="flex items-center">
                  <span className="mr-1">{repo.stargazers_count}</span>
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              <p className="text-gray-600 mt-2">{repo.description || "No description available"}</p>
              {repo.language && (
                <div className="mt-3 text-sm">
                  <span className="bg-gray-200 rounded-full px-3 py-1">{repo.language}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

