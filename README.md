# 🚀 Snap2Slides - AI-Powered Presentation Generator

Transform your screenshots, handwritten notes, and images into stunning professional presentations with AI magic. Built with Next.js 14, TypeScript, and Google Gemini Vision API.

[![Deploy with Vercel](https://vercel.co## 📞 Support & Contact

- 📧 **Email**: saurabhpareek228@gmail.com
- 💬 **Discord**: @saurabh_pareek_51524
- 🐛 **Issues**: [GitHub Issues](https://github.com/SaurabhCodesAI/snap2slides-hackathon/issues)
- 💼 **GitHub**: [@SaurabhCodesAI](https://github.com/SaurabhCodesAI)
- 🌐 **Portfolio**: [My Projects](https://github.com/SaurabhCodesAI)n)](https://vercel.com/new/clone?repository-url=https://github.com/SaurabhCodesAI/snap2slides-hackathon)

## ✨ Features

### 🧠 AI-Powered Analysis
- **Gemini Vision API** - Advanced image analysis and content extraction
- **Smart Content Recognition** - Automatically detects titles, bullet points, and structure
- **Theme Suggestions** - AI recommends themes based on your content
- **Color Palette Extraction** - Generates custom themes from your images

### 🎨 Advanced Editor
- **Live Slide Editing** - Click any text to edit inline
- **Drag & Drop Interface** - Intuitive file uploads with clipboard support
- **Real-time Preview** - See changes instantly
- **Professional Themes** - Multiple built-in design systems
- **Custom Animations** - Smooth transitions with Framer Motion

### 📱 Modern UX
- **Responsive Design** - Works perfectly on all devices
- **PWA Ready** - Install as a native app
- **Keyboard Shortcuts** - Power user features
- **Toast Notifications** - Beautiful feedback system
- **Error Boundaries** - Graceful error handling

### 🚀 Export Options
- **PDF Export** - High-quality PDF generation
- **PowerPoint Export** - Native PPTX files
- **HTML Export** - Interactive web presentations
- **Print Optimization** - Perfect for physical handouts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion
- **AI**: Google Gemini Vision API
- **Authentication**: Auth0
- **Database**: MongoDB (optional)
- **Deployment**: Vercel
- **Testing**: Jest + React Testing Library

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud account (for Gemini API)
- Auth0 account (for authentication)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/snap2slides.git
cd snap2slides
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Get API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your `.env.local` file

#### Auth0 Setup
1. Create an [Auth0 account](https://auth0.com/)
2. Create a new application (Single Page Application)
3. Add your domain and callback URLs
4. Copy your credentials to `.env.local`

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
snap2slides/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── gemini/        # Gemini Vision integration
│   ├── page.tsx           # Main application
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── gemini-vision.ts  # Gemini API integration
│   ├── slide-generator.ts # Slide creation logic
│   └── utils.ts          # General utilities
├── types/                # TypeScript definitions
│   └── slides.ts         # Slide-related types
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎯 Core Features Guide

### 1. Upload & Analysis
- **Drag & Drop**: Simply drag images into the dropzone
- **Clipboard Support**: Paste images with Ctrl+V
- **File Validation**: Automatic size and type checking
- **Preview**: See your uploaded image before processing

### 2. AI Processing
The Gemini Vision API analyzes your image to:
- Extract text content and structure
- Identify headings, bullet points, and sections
- Suggest appropriate themes
- Generate color palettes

### 3. Slide Editor
- **Live Editing**: Click any text element to edit
- **Theme Selection**: Choose from professional themes
- **Layout Optimization**: AI-optimized slide layouts
- **Content Enhancement**: AI-powered text improvements

### 4. Export & Share
- **Multiple Formats**: PDF, PPTX, HTML
- **High Quality**: Vector graphics and crisp text
- **Shareable Links**: Direct presentation sharing
- **Print Ready**: Optimized for physical handouts

## 🔧 Advanced Configuration

### Custom Themes
Add your own themes in `lib/slide-generator.ts`:

```typescript
export const CUSTOM_THEME: SlideTheme = {
  id: 'custom',
  name: 'My Custom Theme',
  colors: {
    primary: '#your-color',
    secondary: '#your-color',
    accent: '#your-color',
    background: '#your-color',
    text: '#your-color'
  },
  fonts: {
    heading: 'Your Font, sans-serif',
    body: 'Your Font, sans-serif'
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
