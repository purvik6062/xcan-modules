# Xcan - Interactive Coding Challenge Platform

Xcan is a web-based platform for learning and improving coding skills through interactive challenges. Similar to platforms like CryptoZombies and Agora, Xcan provides a gamified learning experience with an in-browser IDE, challenge management system, and user progress tracking.

## Features

- **In-browser Code Editor**: Write and execute code directly in your browser to solve challenges
- **Challenge Management**: Browse challenges by difficulty level and category
- **Progress Tracking**: Track completed challenges, points earned, and achievements
- **Leaderboard**: Compete with other users and see top performers
- **User Profile**: View your progress, stats, and achievements

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS 4
- **UI Components**: Custom components with responsive design
- **State Management**: React hooks for local state management

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

## Development

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── challenges/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Individual challenge page with code editor
│   │   │   ├── layout.tsx        # Layout for challenges section
│   │   │   └── page.tsx          # Challenges listing page
│   │   ├── leaderboard/
│   │   │   ├── layout.tsx        # Layout for leaderboard section
│   │   │   └── page.tsx          # Leaderboard page
│   │   ├── profile/
│   │   │   ├── layout.tsx        # Layout for profile section
│   │   │   └── page.tsx          # User profile page
│   │   ├── globals.css          # Global CSS
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
├── public/                      # Static assets
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

### Key Components

- **Challenge Editor**: In-browser code editor where users can write and test solutions
- **Challenge Listing**: Filterable grid of available challenges
- **User Profile**: Dashboard showing user progress and achievements
- **Leaderboard**: Ranking system for users based on points and completed challenges

## Future Enhancements

- **Authentication**: User registration and login system
- **Backend Integration**: API service for challenge data and user management
- **Code Execution Engine**: Secure sandbox for running user code
- **Challenge Creation**: Interface for creating and publishing new challenges
- **Community Features**: Discussion forums, comments, and sharing solutions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by educational coding platforms like CryptoZombies and Agora
- Developed as a learning tool for programmers of all levels
