# Replit Configuration

## Overview

This is a full-stack web application built with a modern React frontend and Express.js backend. The application appears to be a YouTube thumbnail generator with advanced customization features, AI integration, and image processing capabilities. It uses a monorepo structure with shared TypeScript schemas and follows a component-based architecture.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Development**: Custom Vite integration for SSR-like development experience

### Data Storage
- **ORM**: Drizzle with TypeScript-first approach
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared TypeScript schemas between frontend and backend

## Key Components

### Thumbnail Generation System
- **Canvas Rendering**: HTML5 Canvas for thumbnail generation
- **Image Processing**: Background removal using Hugging Face Transformers.js
- **AI Integration**: Google Gemini API for AI-powered text generation
- **Export Functionality**: High-quality thumbnail export (1280x720)

### UI Components
- **Design System**: Comprehensive Shadcn/ui component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Controls**: Sliders, color pickers, file uploads
- **Real-time Preview**: Live thumbnail preview with instant updates

### Authentication & User Management
- **User Schema**: Basic user model with username/password
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Session Management**: PostgreSQL-backed sessions

## Data Flow

1. **Client Interaction**: User interacts with control panel components
2. **State Updates**: Configuration changes trigger React state updates
3. **Real-time Preview**: ThumbnailCanvas component renders live preview
4. **AI Enhancement**: Optional AI text generation via Google Gemini API
5. **Image Processing**: Background removal and image manipulation
6. **Export Process**: Canvas-to-image conversion for final download
7. **API Communication**: React Query manages server state and caching

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, Class Variance Authority
- **Development**: Vite, TypeScript, ESBuild

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, PostgreSQL, Neon serverless driver
- **Validation**: Zod for runtime type checking

### AI & Image Processing
- **AI Services**: Google Gemini API for text generation
- **Image Processing**: Hugging Face Transformers.js for background removal
- **Canvas Utilities**: Native HTML5 Canvas API

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict configuration with path mapping
- **Linting**: Built-in TypeScript checking
- **Database**: Drizzle Kit for migrations

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle push for schema updates
4. **Production Startup**: Node.js serves static files and API

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reload
- **Production**: `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` environment variable required
- **API Keys**: Google Gemini API key for AI features

### Hosting Requirements
- **Node.js**: ES modules support required
- **PostgreSQL**: Compatible database (Neon recommended)
- **File Storage**: Static file serving capability
- **Environment Variables**: Secure configuration management

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Enhanced AI Character Positioning System:
  * Added 7 strategic character positions (bottom-right, center-left, full-center, etc.)
  * Improved NO DAMAGE badge with dynamic colors and Medium class indicator
  * Smart character ground shadow controlled by glow effects
  * Enhanced Vegas AI image picker with better selection logic
  * Added Vegas image cycling feature for variety
  * Fixed character positioning to work with all uploaded Vegas backgrounds
- July 01, 2025. Major UI/UX Improvements and Preview Fixes:
  * Fixed character box issue - removed visible borders around characters
  * Added comprehensive AI Auto Enhance All feature for viral optimization
  * Implemented visual grid-based position selector with 9 placement options
  * Added real-time preview with live position indicators
  * Enhanced character size controls with visual feedback and presets
  * Added fine-tuning adjustments (horizontal/vertical offset controls)
  * Improved gaming HUD elements with dynamic energy bars
  * Added export preview with quality indicators
  * Enhanced text effects with better shadows and animations
- July 01, 2025. Comprehensive Website Enhancement - Professional Upgrade:
  * Fixed character box rendering issue - removed visible borders for cleaner look
  * Simplified and streamlined UI - reduced clutter by removing excessive controls
  * Added project save/load functionality with localStorage persistence
  * Implemented project sharing via clipboard (configuration export)
  * Added quick template system with 4 pre-built gaming thumbnail templates
  * Enhanced header with project status indicators and action buttons
  * Added live preview indicators with real-time update badges
  * Implemented keyboard shortcuts (Ctrl+S save, Ctrl+E export, Ctrl+R reset)
  * Enhanced export with smart filename generation based on content
  * Added comprehensive footer with shortcuts, features, and version info
  * Improved overall visual design with better spacing and organization
  * Added saved projects sidebar with quick load/delete functionality
  * Enhanced tips section with 3-column layout for better organization
- July 01, 2025. Major Character Rendering & AI System Overhaul:
  * Completely recreated character rendering system to eliminate gray background artifacts
  * Replaced old background removal with advanced CSS-based approach for clean rendering
  * Added sophisticated character outline glow effects with multi-layer lighting
  * Enhanced character shadows that adapt to background themes (Vegas gold, Arena purple)
  * Created unified AI enhancement system with single "AI AUTO ENHANCE ALL" button
  * Implemented 5-stage AI optimization: text analysis, visual design, background selection, character positioning, finishing touches
  * Added viral and clean style preset modes for instant professional looks
  * Enhanced character-background integration with smart blend modes and positioning
  * Fixed preview-export consistency - preview now matches exported quality
  * Added progressive enhancement feedback with real-time stage indicators
- July 01, 2025. Google AI API Upgrade & Enhanced Intelligence:
  * Updated Google Gemini API from v1.5 to v2.5 Flash for improved performance and efficiency
  * Enhanced AI prompts with sophisticated color psychology and visual hierarchy analysis
  * Added comprehensive background selection AI with 10+ theme options and psychological matching
  * Implemented advanced character positioning intelligence with content-aware placement
  * Added AI thumbnail analysis feature with viral scoring and actionable insights
  * Created intelligent error recovery system with fallback optimizations
  * Enhanced user feedback with detailed enhancement results and professional scoring
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```