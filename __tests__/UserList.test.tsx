import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../components/user-list';
import { User } from '../types';

describe('UserList Component', () => {
  const mockUsers: User[] = [
    { id: 1, login: 'user1', avatar_url: 'https://example.com/user1.jpg' },
    { id: 2, login: 'user2', avatar_url: 'https://example.com/user2.jpg' },
  ];
  
  const mockOnSelectUser = jest.fn();

  beforeEach(() => {
    mockOnSelectUser.mockClear();
  });

  test('renders nothing when no users are provided', () => {
    const { container } = render(
      <UserList 
        users={[]} 
        searchQuery="test" 
        selectedUser={null} 
        onSelectUser={mockOnSelectUser} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders list of users', () => {
    render(
      <UserList 
        users={mockUsers} 
        searchQuery="test" 
        selectedUser={null} 
        onSelectUser={mockOnSelectUser} 
      />
    );
    
    expect(screen.getByText('Showing users for "test"')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    
    // Check that avatars are rendered
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute('src', 'https://example.com/user1.jpg');
    expect(avatars[1]).toHaveAttribute('src', 'https://example.com/user2.jpg');
  });

  test('calls onSelectUser when a user is clicked', () => {
    render(
      <UserList 
        users={mockUsers} 
        searchQuery="test" 
        selectedUser={null} 
        onSelectUser={mockOnSelectUser} 
      />
    );
    
    fireEvent.click(screen.getByText('user1'));
    expect(mockOnSelectUser).toHaveBeenCalledWith(mockUsers[0]);
    
    fireEvent.click(screen.getByText('user2'));
    expect(mockOnSelectUser).toHaveBeenCalledWith(mockUsers[1]);
  });

  test('highlights selected user', () => {
    render(
      <UserList 
        users={mockUsers} 
        searchQuery="test" 
        selectedUser={mockUsers[0]} 
        onSelectUser={mockOnSelectUser} 
      />
    );
    
    // The implementation details of highlighting might vary, so this test
    // might need adjustment based on your actual implementation
    const userElements = screen.getAllByText(/user\d/);
    
    // The container of the first user should have a different background class
    const user1Container = userElements[0].closest('div');
    const user2Container = userElements[1].closest('div');
    
    expect(user1Container).toHaveClass('bg-blue-50');
    expect(user2Container).not.toHaveClass('bg-blue-50');
  });
});