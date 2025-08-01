# 📸 Snap2Slides – AI-Powered Presentation Generator

[![CI/CD Pipeline](https://github.com/SaurabhCodesAI/snap2slides-hackathon/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/SaurabhCodesAI/snap2slides-hackathon/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![Code Coverage](https://codecov.io/gh/SaurabhCodesAI/snap2slides-hackathon/branch/main/graph/badge.svg)](https://codecov.io/gh/SaurabhCodesAI/snap2slides-hackathon)

Transform your screenshots, handwritten notes, and images into stunning professional presentations with AI magic. Built with industry best practices using Next.js 14, TypeScript, and Google Gemini Vision API.

## ✨ Features

### 🧠 AI-Powered Analysis
- **Gemini Vision API** - Advanced image analysis and content extraction
- **Smart Content Recognition** - Automatically detects titles, bullet points, and structure
- **Theme Suggestions** - AI recommends themes based on your content
- **Color Palette Extraction** - Generates custom themes from your images
- **Smart Flow Optimization** - AI organizes slides for better storytelling

### 🎨 Advanced Editor
- **Live Slide Editing** - Click any text to edit inline
- **Drag & Drop Interface** - Intuitive file uploads with clipboard support
- **Real-time Preview** - See changes instantly with optimized performance
- **Professional Themes** - Multiple built-in design systems
- **Custom Animations** - Smooth transitions with reduced motion support
- **Accessibility First** - WCAG 2.1 AA compliant with full keyboard navigation

### 📱 Modern UX/DX
- **Responsive Design** - Mobile-first approach with touch optimization
- **PWA Ready** - Install as a native app with offline support
- **Keyboard Shortcuts** - Power user features with help modal
- **Toast Notifications** - Beautiful feedback system with error handling
- **Error Boundaries** - Graceful error handling with recovery options
- **Performance Monitoring** - Built-in analytics and Core Web Vitals tracking

### 🚀 Export & Deployment
- **Multiple Formats** - PDF, PowerPoint (PPTX), HTML, Interactive web
- **High Performance** - Optimized builds with code splitting
- **Docker Support** - Production-ready containerization
- **CI/CD Pipeline** - Automated testing, building, and deployment
- **Health Monitoring** - Built-in health checks and observability

## 🛠️ Tech Stack & Architecture

### Core Technologies
- **Frontend**: Next.js 14 (App Router) + TypeScript 5.0+
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion with accessibility support
- **AI**: Google Gemini Vision API with intelligent retry logic
- **Authentication**: Auth0 with JWT and role-based access
- **Database**: MongoDB with connection pooling
- **State Management**: React hooks with optimized updates

### Development & Operations
- **Testing**: Jest + React Testing Library + Playwright E2E
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks
- **Type Safety**: Strict TypeScript with advanced configurations
- **Performance**: Bundle analysis, Core Web Vitals monitoring
- **Security**: OWASP best practices, automated vulnerability scanning
- **Deployment**: Vercel with Docker containerization support
- **Monitoring**: Health checks, error tracking, performance metrics

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Google Cloud account (for Gemini API)
- Auth0 account (optional, for authentication)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/snap2slides.git
cd snap2slides

# Install dependencies
npm install
# or with yarn
yarn install
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Required: Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Required: Auth0 Configuration
AUTH0_SECRET=your-random-secret-string-32-chars-min
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Optional: Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/snap2slides
MONGODB_DB=snap2slides

# Optional: Performance & Analytics
VERCEL_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Development
NODE_ENV=development
```

### API Keys Setup

#### 🔑 Google Gemini API (Required)
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key" and create a new key
3. Copy the key to `GEMINI_API_KEY` in your `.env.local`
4. Ensure billing is enabled for production usage

#### 🔐 Auth0 Setup (Required)
1. Create an [Auth0 account](https://auth0.com/)
2. Create a new Single Page Application
3. Configure settings:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback/auth0`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy credentials to your `.env.local`

#### 🗄️ MongoDB Setup (Optional)
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb/brew/mongodb-community
# Linux: apt-get install mongodb
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Run with performance profiling
npm run dev:profile

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
npm run format

# Testing
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e

# Build and preview
npm run build
npm run start
npm run analyze    # Bundle analysis
```

### Verify Installation

Visit [http://localhost:3000](http://localhost:3000) to see the application.

#### Health Checks
- **API Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Gemini API**: [http://localhost:3000/api/health/gemini](http://localhost:3000/api/health/gemini)
- **Database**: [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db)

## 📁 Project Structure & Architecture

```
snap2slides/
├── 📱 app/                         # Next.js 14 App Router
│   ├── 🔌 api/                    # API routes with type safety
│   │   ├── auth/[auth0]/          # Auth0 authentication
│   │   ├── gemini-vision/         # AI image analysis
│   │   ├── generate-pptx-slides/  # PowerPoint generation
│   │   ├── health/                # Health check endpoints
│   │   ├── history/               # User session management
│   │   └── upload-image/          # File upload handling
│   ├── viewer/[id]/               # Dynamic slide viewer
│   ├── auth-provider.tsx          # Authentication context
│   ├── globals.css                # Global styles with CSS variables
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main application entry
├── 🏗️ lib/                        # Core utilities & services
│   ├── accessibility.tsx          # A11y utilities & components
│   ├── errors.ts                  # Error handling framework
│   ├── mongodb.ts                 # Database connection
│   ├── performance.ts             # Performance monitoring
│   └── validation-schemas.ts      # Zod validation schemas
├── 🧩 types/                      # TypeScript definitions
│   └── slides.ts                  # Slide-related type system
├── 🔨 utils/                      # Shared utilities
│   └── validation-schemas.ts      # Additional validation
├── 🐳 .docker/                    # Docker configuration
│   ├── Dockerfile                 # Multi-stage build
│   ├── docker-compose.yml         # Development stack
│   └── docker-compose.prod.yml    # Production stack
├── 🤖 .github/                    # GitHub automation
│   ├── workflows/ci-cd.yml        # CI/CD pipeline
│   └── ISSUE_TEMPLATE/            # Issue templates
├── 📋 eslint.config.mjs           # ESLint with strict rules
├── 🔧 next.config.mjs             # Next.js optimization
├── 📊 tailwind.config.mjs         # Design system config
└── ⚙️ tsconfig.json               # Strict TypeScript config
```

### Architecture Principles

#### 🏛️ **Clean Architecture**
- **Domain Layer**: Types and business logic in `types/` and `lib/`
- **Application Layer**: API routes with clear separation of concerns
- **Infrastructure Layer**: Database, external APIs, and file system
- **Presentation Layer**: React components with performance optimization

#### 🔒 **Security First**
- **Content Security Policy**: Configured in Next.js config
- **Input Validation**: Zod schemas for all API endpoints
- **Error Boundaries**: Graceful error handling throughout the app
- **Authentication**: Auth0 with JWT and role-based access control

#### ⚡ **Performance Optimized**
- **Code Splitting**: Automatic route-based and component-based splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Bundle Analysis**: Built-in bundle size monitoring
- **Core Web Vitals**: Real-time performance tracking

## 🎯 Core Features & Usage Guide

### 🖼️ **Image Upload & Processing**
```typescript
// Multiple upload methods supported
const uploadMethods = {
  dragDrop: "Drag images directly into the dropzone",
  clipboard: "Paste with Ctrl+V (Cmd+V on Mac)",
  fileDialog: "Click to browse and select files",
  camera: "Mobile camera capture support"
};
```

**Supported Formats**: JPG, PNG, WebP, GIF (static), HEIC (converted)
**Size Limits**: 10MB per file, batch upload up to 50 files
**Processing**: Real-time progress with abort capability

### 🤖 **AI-Powered Analysis**
The Gemini Vision API provides:

```typescript
interface AIAnalysis {
  content: {
    title: string;
    sections: Array<{
      heading: string;
      bullets: string[];
      images?: string[];
    }>;
  };
  suggestions: {
    themes: ThemeRecommendation[];
    colorPalette: ColorPalette;
    layout: LayoutSuggestion;
  };
  metadata: {
    confidence: number;
    processingTime: number;
    imageAnalysis: ImageMetadata;
  };
}
```

**Key Capabilities**:
- 📝 Text extraction with OCR and handwriting recognition
- 🎨 Color palette extraction from images
- 📊 Chart and diagram interpretation
- 🏗️ Automatic content structure detection
- 💡 Theme and layout recommendations

### ✏️ **Interactive Slide Editor**
```typescript
// Real-time editing with optimistic updates
const editorFeatures = {
  inlineEditing: "Click any text to edit with autosave",
  dragReorder: "Drag slides to reorder presentation",
  themeSwitch: "Live theme preview without data loss",
  undoRedo: "Full edit history with Ctrl+Z support",
  autoLayout: "AI-optimized responsive layouts",
  accessibility: "Full keyboard navigation and screen reader support"
};
```

**Editor Shortcuts**:
- `Ctrl+Z` / `Cmd+Z`: Undo last action
- `Ctrl+Y` / `Cmd+Shift+Z`: Redo
- `Ctrl+S` / `Cmd+S`: Manual save (auto-save every 30s)
- `Ctrl+P` / `Cmd+P`: Print preview
- `F11`: Fullscreen presentation mode

### 📤 **Export & Sharing Options**

```typescript
interface ExportOptions {
  formats: {
    pdf: "High-quality PDF with vector graphics";
    pptx: "Native PowerPoint with full editing capability";
    html: "Interactive web presentation with animations";
    png: "High-resolution image sequence";
  };
  sharing: {
    publicLink: "Shareable URL with optional password protection";
    embed: "Iframe embed code for websites";
    download: "Direct file download";
  };
  customization: {
    resolution: "720p, 1080p, 4K options";
    aspectRatio: "16:9, 4:3, or custom ratios";
    animations: "Include/exclude slide transitions";
  };
}
```

## 🔧 Advanced Configuration & Customization

### 🎨 **Custom Themes**
Create your own presentation themes:

```typescript
// lib/themes/custom-theme.ts
export const myCustomTheme: SlideTheme = {
  id: 'my-corporate',
  name: 'Corporate Brand',
  colors: {
    primary: '#1a365d',      // Navy blue
    secondary: '#2d3748',    // Dark gray
    accent: '#3182ce',       // Blue accent
    background: '#ffffff',   // White background
    text: '#2d3748',        // Dark text
## 🧪 Testing & Quality Assurance

### Testing Strategy
Our comprehensive testing approach ensures reliability and maintainability:

```typescript
// Testing pyramid implementation
const testingStrategy = {
  unit: "Jest + React Testing Library (70%)",
  integration: "API route testing with Next.js testing utils (20%)",
  e2e: "Playwright with visual regression testing (10%)",
  accessibility: "axe-core + manual testing",
  performance: "Lighthouse CI + Core Web Vitals monitoring"
};
```

### Running Tests

```bash
# Unit tests with coverage
npm run test
npm run test:coverage
npm run test:watch

# E2E tests across browsers
npm run test:e2e
npm run test:e2e:headed    # With browser UI
npm run test:e2e:debug     # With debugging

# Accessibility testing
npm run test:a11y

# Performance testing
npm run test:perf
npm run lighthouse
```

### Code Quality Tools

```bash
# Linting and formatting
npm run lint              # ESLint check
npm run lint:fix          # Auto-fix issues
npm run format            # Prettier formatting
npm run type-check        # TypeScript compilation

# Pre-commit hooks (automatically run)
npm run pre-commit        # Lint + format + test
```

## 🚀 Deployment & Production

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Docker Deployment
```bash
# Build and run production container
docker build -f .docker/Dockerfile -t snap2slides .
docker run -p 3000:3000 --env-file .env.production snap2slides

# Using Docker Compose
docker-compose -f .docker/docker-compose.prod.yml up -d
```

### Environment Variables for Production
```env
# Production-specific variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Security
CSP_REPORT_URI=https://your-domain.com/api/csp-report
SECURE_HEADERS=true

# Performance
ENABLE_BUNDLE_ANALYZER=false
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Monitoring & Analytics
SENTRY_DSN=your-sentry-dsn
VERCEL_ANALYTICS_ID=your-analytics-id
```

## 📊 Performance & Monitoring

### Performance Metrics
We maintain excellent Core Web Vitals:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Monitoring Setup
```typescript
// Built-in performance monitoring
import { PerformanceMonitor } from '@/lib/performance';

// Track component performance
const MyComponent = withPerformanceTracking(BaseComponent);

// Manual performance tracking
PerformanceMonitor.measureUserTiming('slideGeneration', async () => {
  // Your performance-critical code
});

// Core Web Vitals tracking
PerformanceMonitor.observeWebVitals((metric) => {
  // Send to analytics service
  analytics.track('web-vital', metric);
});
```

## 🔒 Security Best Practices

### Security Features Implemented
- ✅ **Content Security Policy (CSP)** - Prevents XSS attacks
- ✅ **Input Validation** - Zod schemas for all inputs
- ✅ **Rate Limiting** - API endpoint protection
- ✅ **File Upload Security** - Type and size validation
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **HTTPS Enforcement** - Secure connections only
- ✅ **Auth0 Integration** - Professional authentication
- ✅ **Error Boundaries** - Prevent information leakage

### Security Checklist
```bash
# Run security audit
npm audit
npm audit fix

# Check for vulnerabilities
npm run security:check

# Update dependencies
npm run deps:update
npm run deps:check
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with tests
4. **Run** quality checks: `npm run pre-commit`
5. **Commit** with conventional commits: `git commit -m "feat: add amazing feature"`
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Create** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **React**: Hooks-based components with proper dependency arrays
- **Testing**: Minimum 80% code coverage required
- **Accessibility**: WCAG 2.1 AA compliance mandatory
- **Performance**: Bundle size budget enforced
- **Security**: OWASP guidelines followed

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new slide transition animations
fix: resolve image upload timeout issues
docs: update API documentation
style: improve button hover states
refactor: optimize slide rendering performance
test: add E2E tests for export functionality
chore: update dependencies
```

## 📄 License & Acknowledgments

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments
- **Google Gemini Team** - For the powerful Vision API
- **Vercel Team** - For the amazing Next.js framework
- **Auth0 Team** - For seamless authentication
- **Tailwind CSS** - For the utility-first CSS framework
- **Community Contributors** - For continuous improvements

### Third-Party Libraries
Key dependencies and their licenses:
- `next` (MIT) - React framework
- `react` (MIT) - UI library
- `typescript` (Apache-2.0) - Type system
- `tailwindcss` (MIT) - CSS framework
- `@auth0/nextjs-auth0` (MIT) - Authentication
- `framer-motion` (MIT) - Animations
- `zod` (MIT) - Schema validation

## 🆘 Support & Community

### Getting Help
- **Documentation**: Complete guides in the [docs folder](docs/)
- **GitHub Issues**: [Bug reports and feature requests](https://github.com/yourusername/snap2slides/issues)
- **Discussions**: [Community Q&A](https://github.com/yourusername/snap2slides/discussions)
- **Discord**: [Join our community server](https://discord.gg/snap2slides)

### Frequently Asked Questions

#### **Q: Can I use this without Auth0?**
A: Yes! Set `SKIP_AUTH=true` in your environment variables for development or implement your own auth provider.

#### **Q: What's the maximum file size for uploads?**
A: Default is 10MB per file. You can configure this with the `MAX_FILE_SIZE` environment variable.

#### **Q: Does this work offline?**
A: Partially. The PWA can cache the interface, but AI processing requires an internet connection.

#### **Q: Can I self-host this application?**
A: Absolutely! Use the provided Docker configuration or deploy to any Node.js hosting provider.

#### **Q: Is there an API for programmatic access?**
A: Yes! All core functionality is available via REST APIs. See our [API documentation](docs/api.md).

---

<div align="center">

**Built with ❤️ for the developer community**

[⭐ Star this repo](https://github.com/yourusername/snap2slides) | [🐛 Report Bug](https://github.com/yourusername/snap2slides/issues) | [💡 Request Feature](https://github.com/yourusername/snap2slides/issues) | [💬 Join Discussion](https://github.com/yourusername/snap2slides/discussions)

</div>
  },
  layout: 'modern'
};
```

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini Vision API key | ✅ |
| `AUTH0_SECRET` | Auth0 secret | ✅ |
| `AUTH0_CLIENT_ID` | Auth0 client ID | ✅ |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | ✅ |
| `AUTH0_ISSUER_BASE_URL` | Auth0 domain | ✅ |
| `MONGODB_URI` | MongoDB connection string | ❌ |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console | ❌ |

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/snap2slides)

### Other Platforms
- **Netlify**: Works with build command `npm run build`
- **Railway**: Configure environment variables
- **Digital Ocean**: Use App Platform

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type checking
npm run type-check
```

## 📝 API Documentation

### POST `/api/gemini/analyze`
Analyzes an uploaded image and generates slides.

**Request Body** (FormData):
- `image`: File (required) - Image file to analyze
- `prompt`: string (optional) - Additional context for AI
- `theme`: string (optional) - Preferred theme

**Response**:
```json
{
  "success": true,
  "analysis": {
    "structuredContent": {
      "title": "Extracted Title",
      "sections": [...]
    },
    "suggestedTheme": "modern",
    "colorPalette": ["#color1", "#color2"],
    "confidence": 0.95
  },
  "presentation": {
    "id": "presentation-id",
    "slides": [...]
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** - For powerful AI vision capabilities
- **Vercel** - For seamless deployment
- **Auth0** - For secure authentication
- **Framer Motion** - For beautiful animations
- **Tailwind CSS** - For utility-first styling


## Demo link
- **Youtube**: https://www.youtube.com/watch?v=G8rV8L0Eo_A


## 📞 Support & Contact

- 📧 **Email**: saurabhpareek228@gmail.com
- 💬 **Discord**: Connect with me on Discord
- 🐛 **Issues**: [GitHub Issues](https://github.com/SaurabhCodesAI/snap2slides-hackathon/issues)
- � **GitHub**: [@SaurabhCodesAI](https://github.com/SaurabhCodesAI)
- 🌐 **Portfolio**: [My Projects](https://github.com/SaurabhCodesAI)

## 👨‍💻 Developer

**Saurabh Pareek** - AI Enthusiast
- Passionate about building innovative AI-powered applications
- Hackathon participant creating the future of presentation tools
- Always open to collaboration and feedback!

---

**Built with ☕ by the Snap2Slides team**

Transform your ideas into presentations in seconds. Try Snap2Slides today!
