# GitHub Repositories Explorer

A React application that allows users to search for GitHub users and explore their repositories.

## Features

- Search for GitHub users (up to 5 users with similar usernames)
- View user details and repositories
- Repository information includes title, description, star count, and language
- Responsive design supporting both desktop and mobile views
- Keyboard navigation support
- Error handling and loading states
- Debounced search for better performance

## Live Demo

https://github.com/user-attachments/assets/79385058-6b7f-4a53-ab31-e4f54f5d7080

## Technologies Used

- NextJS
- TypeScript
- TailwindCSS for styling
- GitHub API v3

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-github-username/github-repos-explorer.git
   cd github-repos-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## GitHub API Rate Limits

The GitHub API has rate limiting, which means there's a limit to how many requests you can make within a specific time period. For unauthenticated requests, the rate limit is 60 requests per hour.

If you encounter rate limit issues, you might want to consider:
- Implementing authentication with a GitHub Personal Access Token (for higher rate limits)
- Adding caching mechanisms for search results

## Project Structure

```
src/
├── components/         # React components
│   ├── UserSearch.tsx  # Search input and functionality
│   ├── UserList.tsx    # Displays list of searched users
│   ├── RepositoryList.tsx # Shows repositories for selected user
│   ├── ErrorMessage.tsx   # Error message component
│   └── LoadingSpinner.tsx # Loading indicator
├── types/              # TypeScript type definitions
│   └── index.ts
├── services/           # API services
│   └── githubApi.ts    # GitHub API integration
├── hooks/              # Custom React hooks
│   └── useDebounce.ts  # Debounce functionality for search
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── styles.css          # Global styles
```

## Deployment

To deploy the application to GitHub Pages:

1. Update the `homepage` field in `package.json` with your GitHub Pages URL:
   ```json
   "homepage": "https://your-github-username.github.io/github-repos-explorer"
   ```

2. Build and deploy the application:
   ```bash
   npm run build
   npm run deploy
   # or
   yarn build
   yarn deploy
   ```

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

### Test Coverage

The application has excellent test coverage as shown below:

```
 PASS  **tests**/App.test.tsx (6.417 s)
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |     100 |    91.48 |     100 |     100 |                   
 app                  |     100 |      100 |     100 |     100 |                   
  page.tsx            |     100 |      100 |     100 |     100 |                   
 components           |     100 |    88.57 |     100 |     100 |                   
  error-message.tsx   |     100 |      100 |     100 |     100 |                   
  loading-spinner.tsx |     100 |      100 |     100 |     100 |                   
  repository-list.tsx |     100 |    92.85 |     100 |     100 | 24                
  user-list.tsx       |     100 |       80 |     100 |     100 | 18,30             
  user-search.tsx     |     100 |       90 |     100 |     100 | 34                
 hooks                |     100 |      100 |     100 |     100 |                   
  use-debounce.ts     |     100 |      100 |     100 |     100 |                   
 services             |     100 |      100 |     100 |     100 |                   
  github-api.ts       |     100 |      100 |     100 |     100 |                   
----------------------|---------|----------|---------|---------|-------------------
```

The test suite achieves 100% line coverage and over 91% branch coverage, demonstrating the robustness of the application.

## Future Improvements

- Add authentication support for higher API rate limits
- Implement search query history
- Add sorting and filtering options for repositories
- Add pagination for repositories (especially for users with many repositories)
- Improve test coverage with more unit and integration tests
- Add dark mode support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [GitHub API Documentation](https://developer.github.com/v3/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
