# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Overview

This is a Next.js application for managing activity configurations in a gaming/social platform called "Sheng Ba" (盛巴). The app provides a visual interface for configuring various activities like gemstone collection, lottery, sign-in rewards, recharge bonuses, and mid-year campaigns.

## Architecture

### Core Structure
- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, and ShadCN components
- **Backend Integration**: API routes that proxy to PHP backend services
- **State Management**: React hooks for local state management
- **Styling**: TailwindCSS with Radix UI components

### Key Directories
- `app/` - Next.js app router with pages and API routes
- `components/` - Reusable UI components and activity-specific configurations
- `types/` - TypeScript type definitions for activities, configs, and monitoring
- `config/` - Default configurations and environment settings
- `utils/` - Utility functions and validators

### Activity System
The application uses a modular activity system where each activity type has:
- **Type Definition**: Defined in `types/activity.ts` with supported types: gem, red_packet, lottery, signin, recharge, midyear, universal
- **Router Component**: `ActivityConfigRouter.tsx` dispatches to specific config components
- **Config Components**: Individual components like `GemActivityConfig.tsx`, `MidYearActivityConfig.tsx`
- **API Endpoints**: Separate routes for config retrieval and monitoring under `app/api/`

### Backend Integration
- Environment-aware API configuration in `config/environment.ts`
- Test and production endpoint switching based on `NODE_ENV`
- PHP backend integration with specific URL patterns for different activities
- Default fallback configurations in `config/defaultConfig.ts`

### Data Flow
1. User selects activity type from `ActivitySelector`
2. `ActivityConfigRouter` renders appropriate config component
3. Config components make API calls to Next.js routes
4. API routes proxy requests to PHP backend
5. Configuration data is validated and displayed in forms

## Important Notes

- The application supports both Chinese and English text
- All activity configurations include monitoring capabilities
- The default configuration contains extensive game-specific settings
- Environment switching is handled automatically based on NODE_ENV
- Backend URLs contain authentication parameters and activity IDs