import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserSearch from '../components/user-search';
import { searchUsers } from '../services/github-api';

jest.mock('../services/github-api');

const mockSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>;

describe('UserSearch Component', () => {
  const mockOnUsersFound = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockSearchUsers.mockClear();
    mockOnUsersFound.mockClear();
    mockOnError.mockClear();
  });

  test('renders search input and button', () => {
    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('calls searchUsers when input value changes', async () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    ];

    mockSearchUsers.mockResolvedValueOnce(mockUsers);

    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for the debounced search to execute
    await waitFor(() => expect(mockSearchUsers).toHaveBeenCalledWith('test'));
    expect(mockOnUsersFound).toHaveBeenCalledWith(mockUsers, 'test');
  });

  test('shows loading state during search', async () => {
    mockSearchUsers.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([]);
        }, 100);
      });
    });

    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Check for loading indicator
    expect(screen.getByText('Searching...')).toBeInTheDocument();

    // Wait for the search to complete
    await waitFor(() => expect(screen.getByText('Search')).toBeInTheDocument());
  });

  test('handles search errors', async () => {
    const errorMessage = 'API rate limit exceeded';
    mockSearchUsers.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for error to be handled
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('clears search results when input is empty', async () => {
    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    // First, add some text
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Then clear the input
    fireEvent.change(input, { target: { value: '' } });

    // Check that onUsersFound was called with empty array
    await waitFor(() => {
      expect(mockOnUsersFound).toHaveBeenCalledWith([], '');
    });
  });

  test('handles generic error when error is not an Error instance', async () => {
    mockSearchUsers.mockRejectedValueOnce('Not an error instance');

    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    const input = screen.getByPlaceholderText('Enter GitHub username');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for error to be handled
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('An unknown error occurred');
    });
  });

  test('submits form without triggering new search', async () => {
    render(
      <UserSearch onUsersFound={mockOnUsersFound} onError={mockOnError} />
    );
    
    const form = screen.getByRole('button', { name: 'Search' }).closest('form');
    const input = screen.getByPlaceholderText('Enter GitHub username');
    
    // Add some text to the input
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Verify that no additional search was triggered
    expect(mockSearchUsers).toHaveBeenCalledTimes(1);
  });
});