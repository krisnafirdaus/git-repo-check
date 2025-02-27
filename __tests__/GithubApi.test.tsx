import { searchUsers, getUserRepositories } from '../services/github-api';

// Mock global fetch
global.fetch = jest.fn();

describe('GitHub API Service', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Tests for searchUsers
  describe('searchUsers function', () => {
    test('returns empty array for empty query', async () => {
      const result = await searchUsers('');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('returns empty array for whitespace-only query', async () => {
      const result = await searchUsers('   ');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('calls GitHub API with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: [] })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await searchUsers('testuser');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/search/users?q=testuser&per_page=5');
    });

    test('properly encodes query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: [] })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await searchUsers('test user+org');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/search/users?q=test%20user%2Borg&per_page=5');
    });

    test('returns user items from successful response', async () => {
      const mockUsers = [
        { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
        { id: 2, login: 'user2', avatar_url: 'https://example.com/user2.jpg' }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockUsers })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      const result = await searchUsers('test');
      
      expect(result).toEqual(mockUsers);
    });

    test('throws error on failed API response', async () => {
      const mockResponse = {
        ok: false,
        status: 403
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await expect(searchUsers('test')).rejects.toThrow('GitHub API error: 403');
    });

    test('throws error when fetch fails', async () => {
      const networkError = new Error('Network failure');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(searchUsers('test')).rejects.toThrow(networkError);
    });
  });

  // Tests for getUserRepositories
  describe('getUserRepositories function', () => {
    test('calls GitHub API with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([])
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await getUserRepositories('testuser');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/users/testuser/repos?sort=updated');
    });

    test('properly encodes username parameter', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([])
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await getUserRepositories('test user');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/users/test%20user/repos?sort=updated');
    });

    test('returns repositories from successful response', async () => {
      const mockRepos = [
        { 
          id: 1, 
          name: 'repo1', 
          description: 'Test repository 1', 
          stargazers_count: 10,
          html_url: 'https://github.com/user1/repo1',
          language: 'JavaScript', 
          created_at: '2021-01-01T00:00:00Z',
          updated_at: '2021-02-01T00:00:00Z'
        },
        { 
          id: 2, 
          name: 'repo2', 
          description: 'Test repository 2', 
          stargazers_count: 20,
          html_url: 'https://github.com/user1/repo2',
          language: 'TypeScript', 
          created_at: '2021-03-01T00:00:00Z',
          updated_at: '2021-04-01T00:00:00Z'
        }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockRepos)
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      const result = await getUserRepositories('testuser');
      
      expect(result).toEqual(mockRepos);
    });

    test('throws error on failed API response', async () => {
      const mockResponse = {
        ok: false,
        status: 404
      };
      mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response);

      await expect(getUserRepositories('testuser')).rejects.toThrow('GitHub API error: 404');
    });

    test('throws error when fetch fails', async () => {
      const networkError = new Error('Network failure');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(getUserRepositories('testuser')).rejects.toThrow(networkError);
    });
  });
});