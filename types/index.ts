export interface User {
  id: number
  login: string
  avatar_url: string
}

export interface Repository {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  html_url: string
  language: string | null
  created_at: string
  updated_at: string
}

