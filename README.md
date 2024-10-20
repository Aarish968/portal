# PorterInitialAppRepo

This repository serves as the initial template for creating new React web applications at Porter. It provides a solid foundation with pre-configured tools and a standardized project structure to kickstart development.

## Project Status

⚠️ **IMPORTANT**: This project is a work in progress. Many features are incomplete, and significant design decisions are still pending. The codebase is subject to major changes.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- UnoCSS for utility-first CSS
- Pre-configured routing with React Router
- State management with Zustand
- Internationalization (i18n) support
- Authentication flow and protected routes
- Customizable UI components using Shadcn UI
- ESLint and Prettier for code linting and formatting
- Vitest for unit testing

## Getting Started

To create a new project using this template:

1. Clone this repository:

   ```
   git clone https://github.com/your-org/PorterInitialAppRepo.git your-project-name
   ```

2. Navigate to the project directory:

   ```
   cd your-project-name
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Initialize and update the git submodule with `git submodule update --init --recursive`

5. Start the development server:

   ```
   npm run dev
   ```

6. Open your browser and visit `http://localhost:3000`

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable React components
├── contexts/       # React context providers
├── data/           # Static data and configuration files
├── layouts/        # Layout components
├── models/         # Domain-specific logic and components
├── routes/         # Route definitions
├── utils/          # Utility functions and helpers
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── vite-env.d.ts   # TypeScript declarations for Vite
```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production-ready application
- `npm run lint`: Run ESLint to check for code quality issues
- `npm run typecheck`: Run TypeScript type checking
- `npm run test:unit`: Run unit tests with Vitest
- `npm run test:e2e`: Run end-to-end tests (when configured)
- `npm run preview`: Preview the production build locally

## Getting Started

As this project is not yet ready for general use, these instructions are primarily for those who want to see how the project is structured and how to run the development server:

1. Clone the repository
2. Initialize and update the git submodule with `git submodule update --init --recursive`
3. Install dependencies with `pnpm install`
4. Start the development server with `pnpm run dev`

## Contributing

We are not currently accepting external contributions as the project is in early development stages. This policy will be revised as the project matures.

## Known Issues and Limitations

- Many features are incomplete or non-functional
- The UI design is not finalized
- Performance optimizations have not yet been implemented

---
