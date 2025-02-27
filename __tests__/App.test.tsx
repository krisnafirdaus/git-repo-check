import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../app/page';
import { searchUsers, getUserRepositories } from '../services/github-api';

jest.mock('../services/github-api');

const mockSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>;
const mockGetUserRepositories = getUserRepositories as jest.MockedFunction<typeof getUserRepositories>;

describe('App Component', () => {
  beforeEach(() => {
    mockSearchUsers.mockClear();
    mockGetUserRepositories.mockClear();
  });

  test('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('GitHub Repositories Explorer')).toBeInTheDocument();
  });

  test('shows search input and button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('searches for users when input value changes', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
      { id: 2, login: 'user2', avatar_url: 'https://example.com/user2.jpg' },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for the debounced search to execute
    await waitFor(() => expect(mockSearchUsers).toHaveBeenCalledWith('test'));

    // Check if users are displayed
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  test('loads repositories when a user is clicked', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    const mockRepos = [
      { 
        id: 101, 
        name: 'repo1', 
        description: 'Test repository 1', 
        stargazers_count: 10,
        html_url: 'https://github.com/user1/repo1',
        language: 'JavaScript', 
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-02-01T00:00:00Z'
      },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockGetUserRepositories.mockResolvedValueOnce(mockRepos);

    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for users to be displayed
    await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());

    // Click on a user
    fireEvent.click(screen.getByText('user1'));

    // Verify that repositories are fetched
    await waitFor(() => expect(mockGetUserRepositories).toHaveBeenCalledWith('user1'));

    // Check if repository information is displayed
    await waitFor(() => {
      expect(screen.getByText('user1\'s repositories')).toBeInTheDocument();
      expect(screen.getByText('repo1')).toBeInTheDocument();
      expect(screen.getByText('Test repository 1')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  test('clicking the same user toggles selection off', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    const mockRepos = [
      { 
        id: 101, 
        name: 'repo1', 
        description: 'Test repository 1', 
        stargazers_count: 10,
        html_url: 'https://github.com/user1/repo1',
        language: 'JavaScript', 
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-02-01T00:00:00Z'
      },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockGetUserRepositories.mockResolvedValueOnce(mockRepos);

    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for users to be displayed
    await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());

    // Click on a user to select
    fireEvent.click(screen.getByText('user1'));

    // Verify repository is displayed
    await waitFor(() => {
      expect(screen.getByText('user1\'s repositories')).toBeInTheDocument();
    });

    // Click on the same user again to deselect
    fireEvent.click(screen.getByText('user1'));

    // Verify repository section is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText('user1\'s repositories')).not.toBeInTheDocument();
    });
  });

  test('new search resets user selection', async () => {
    const mockUsers1 = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    const mockUsers2 = [
      { id: 2, login: 'user2', avatar_url: 'https://example.com/user2.jpg' },
    ];

    const mockRepos = [
      { 
        id: 101, 
        name: 'repo1', 
        description: 'Test repository 1', 
        stargazers_count: 10,
        html_url: 'https://github.com/user1/repo1',
        language: 'JavaScript', 
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-02-01T00:00:00Z'
      },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers1);
    mockGetUserRepositories.mockResolvedValueOnce(mockRepos);
    mockSearchUsers.mockResolvedValueOnce(mockUsers2);

    render(<App />);
    
    // First search
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test1' } });

    // Wait for first user to be displayed
    await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());

    // Click on the user
    fireEvent.click(screen.getByText('user1'));

    // Verify repository is displayed
    await waitFor(() => {
      expect(screen.getByText('user1\'s repositories')).toBeInTheDocument();
    });

    // Second search
    fireEvent.change(input, { target: { value: 'test2' } });

    // Wait for second user to be displayed
    await waitFor(() => expect(screen.getByText('user2')).toBeInTheDocument());

    // Verify repository section is no longer displayed (selection was reset)
    expect(screen.queryByText('user1\'s repositories')).not.toBeInTheDocument();
  });

  test('handles errors during user search', async () => {
    mockSearchUsers.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
    });
  });

  test('handles errors during repository fetch', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockGetUserRepositories.mockRejectedValueOnce(new Error('Failed to load repositories'));

    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for users to be displayed
    await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());

    // Click on a user
    fireEvent.click(screen.getByText('user1'));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
    });
  });

  test('handles non-Error instance during repository fetch', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockGetUserRepositories.mockRejectedValueOnce('Not an error instance');

    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for users to be displayed
    await waitFor(() => expect(screen.getByText('user1')).toBeInTheDocument());

    // Click on a user
    fireEvent.click(screen.getByText('user1'));

    // Check if generic error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
    });
  });
});