import { render, screen } from '@testing-library/react';
import RepositoryList from '../components/repository-list';
import { User, Repository } from '../types';

describe('RepositoryList Component', () => {
  const mockUser: User = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://example.com/testuser.jpg'
  };
  
  const mockRepositories: Repository[] = [
    {
      id: 101,
      name: 'repo1',
      description: 'Test repository 1',
      stargazers_count: 10,
      html_url: 'https://github.com/testuser/repo1',
      language: 'JavaScript',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-02-01T00:00:00Z'
    },
    {
      id: 102,
      name: 'repo2',
      description: null,
      stargazers_count: 5,
      html_url: 'https://github.com/testuser/repo2',
      language: 'TypeScript',
      created_at: '2021-03-01T00:00:00Z',
      updated_at: '2021-04-01T00:00:00Z'
    }
  ];

  test('renders nothing when no user is selected', () => {
    const { container } = render(
      <RepositoryList 
        repositories={[]} 
        user={null} 
        isLoading={false} 
        error={null} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('displays loading indicator when loading', () => {
    render(
      <RepositoryList 
        repositories={[]} 
        user={mockUser} 
        isLoading={true} 
        error={null} 
      />
    );
    
    // Check for presence of loading spinner
    // This depends on your LoadingSpinner implementation
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    render(
      <RepositoryList 
        repositories={[]} 
        user={mockUser} 
        isLoading={false} 
        error="Failed to load repositories" 
      />
    );
    
    expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
  });

  test('displays message when no repositories are found', () => {
    render(
      <RepositoryList 
        repositories={[]} 
        user={mockUser} 
        isLoading={false} 
        error={null} 
      />
    );
    
    expect(screen.getByText('No repositories found')).toBeInTheDocument();
  });

  test('renders repository list correctly', () => {
    render(
      <RepositoryList 
        repositories={mockRepositories} 
        user={mockUser} 
        isLoading={false} 
        error={null} 
      />
    );
    
    expect(screen.getByText('testuser\'s repositories')).toBeInTheDocument();
    
    // Check repository names
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
    
    // Check descriptions
    expect(screen.getByText('Test repository 1')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
    
    // Check languages
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    
    // Check star counts (this might need adjustment based on your actual implementation)
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check links
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://github.com/testuser/repo1');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/testuser/repo2');
  });
});