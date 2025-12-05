# Teletext Zero - Project Setup

## Project Structure

```
teletext-zero/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # Constants (grid dimensions, colors)
│   ├── pages/          # Page definitions
│   └── test/           # Test setup and utilities
├── public/             # Static assets
└── node_modules/       # Dependencies
```

## Dependencies Installed

### Core
- React 19.2.0
- React DOM 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4

### Testing
- Vitest 4.0.15 (unit testing framework)
- fast-check 4.3.0 (property-based testing)
- @testing-library/react 16.3.0 (React component testing)
- @testing-library/jest-dom 6.9.1 (DOM matchers)
- jsdom 27.2.0 (DOM environment for tests)

### Fonts
- VT323 (Google Fonts)
- Share Tech Mono (Google Fonts)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Test Configuration

Vitest is configured with:
- Global test APIs enabled
- jsdom environment for DOM testing
- Setup file at `src/test/setup.ts`
- Support for both unit tests and property-based tests

## Next Steps

The project is ready for implementation. Start with task 2: Define core constants and types.
