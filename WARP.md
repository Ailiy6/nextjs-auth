# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (faster builds)
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

### Development Server
The app runs on `http://localhost:3000` by default when using `npm run dev`.

### Testing & Quality
- Use `npm run lint` to check code style and catch potential issues
- ESLint is configured with Next.js TypeScript rules
- The project follows strict TypeScript configuration

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS.

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Runtime**: React 19.1.0 
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript with strict mode enabled
- **Build Tool**: Turbopack for faster development builds
- **Fonts**: Geist Sans and Geist Mono (optimized via next/font)

### Project Structure
```
src/
  app/                 # App Router directory
    layout.tsx         # Root layout component
    page.tsx           # Home page component  
    globals.css        # Global styles with Tailwind imports
    favicon.ico        # Site favicon
public/                # Static assets (SVG icons)
```

### Key Architecture Patterns
- **App Router**: Uses Next.js 13+ App Router pattern with `src/app` directory
- **Server Components**: Default component architecture (components are Server Components unless marked with 'use client')
- **Font Optimization**: Uses `next/font/google` for automatic font optimization
- **CSS Architecture**: Tailwind CSS with custom CSS variables for theming
- **TypeScript Configuration**: Strict mode with path aliases (`@/*` maps to `./src/*`)

### Configuration Files
- `next.config.ts` - Next.js configuration (currently minimal)
- `tsconfig.json` - TypeScript configuration with strict settings
- `eslint.config.mjs` - ESLint configuration using flat config format
- `postcss.config.mjs` - PostCSS configuration for Tailwind processing
- `tailwind.config.*` - Tailwind configuration (using v4 with CSS-first approach)

### Development Notes
- This appears to be a starter project for authentication functionality (based on the project name "auth-nextjs")
- Currently contains default Next.js boilerplate - authentication features are likely to be implemented
- Uses the latest Next.js features including Turbopack for faster builds
- Tailwind CSS v4 uses a different configuration approach than v3 (CSS-based configuration)
- The project structure follows Next.js App Router conventions

### Environment Setup
- Requires Node.js (compatible with Next.js 15)
- TypeScript compilation target is ES2017
- Uses bundler module resolution for modern import/export syntax