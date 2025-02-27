import type { User } from "@/types"
import { ChevronDown } from "lucide-react"

interface UserListProps {
  users: User[]
  searchQuery: string
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

export default function UserList({ users, searchQuery, selectedUser, onSelectUser }: UserListProps) {
  if (users.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <h2 className="text-sm text-gray-500 mb-2">{users.length > 0 ? `Showing users for "${searchQuery}"` : ""}</h2>
      <div className="border rounded divide-y">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
              selectedUser?.id === user.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center">
              <img
                src={user.avatar_url || "/placeholder.svg"}
                alt={`${user.login}'s avatar`}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span>{user.login}</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${selectedUser?.id === user.id ? "transform rotate-180" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

