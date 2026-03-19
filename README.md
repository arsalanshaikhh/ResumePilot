# ResumePilot - AI-Powered Resume Analysis

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)

A modern, production-ready React application that provides AI-powered resume analysis with ATS compatibility checking and job description matching capabilities.

## 🚀 Features

### ATS Compatibility Score Checker
- Upload resumes in PDF, DOCX, or TXT format
- Analyze formatting and keyword optimization for Applicant Tracking Systems
- Get detailed scoring breakdown across multiple categories
- Receive actionable recommendations for improvement

### Job Description Matcher
- Compare your resume against specific job postings
- Calculate match percentage based on keyword alignment
- Identify skill gaps and strengths
- Get personalized improvement suggestions

### Authentication & Security
- Secure user authentication via [Clerk](https://clerk.com)
- Protected routes for authenticated users
- Encrypted API key storage
- User profile management
- Error boundaries for graceful error handling
- Input sanitization for security

### Modern UI/UX
- Clean, professional design with Shadcn/UI components
- Fully responsive for mobile, tablet, and desktop
- Smooth animations and transitions
- Accessible color contrast and keyboard navigation
- Loading skeletons for better perceived performance

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Clerk
- **AI Integration**: OpenRouter API
- **UI Library**: Shadcn/UI + Radix UI primitives
- **Routing**: React Router v6
- **File Handling**: react-dropzone, PDF.js, Mammoth.js
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account for authentication
- OpenRouter API key for AI features

## 🏁 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arsalanshaikhh/ResumePilot.git
cd ResumePilot
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_APP_NAME=ResumePilot
VITE_APP_VERSION=1.0.0
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Production Build

### Build for Production
```bash
npm run build
```

The production build will be generated in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## 🏗️ Project Structure

```
ResumePilot/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/UI components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   ├── auth/           # Authentication components
│   │   ├── resume/         # Resume analysis components
│   │   └── common/         # Shared components (ErrorBoundary, Skeleton)
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ATSAnalyzer.tsx
│   │   ├── JobMatcher.tsx
│   │   ├── Settings.tsx
│   │   ├── ErrorPage.tsx
│   │   └── auth/          # Authentication pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and business logic services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── context/            # React context providers
│   └── lib/                # Library utilities (utils, sanitize, env)
├── public/                 # Static assets
├── dist/                   # Production build output
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## ⚙️ Configuration

### Clerk Authentication

1. Create a Clerk account at [https://clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key to `.env`

### OpenRouter API

1. Create an account at [https://openrouter.ai](https://openrouter.ai)
2. Generate an API key
3. Enter the key in the Settings page of the application

## 📖 Usage

### ATS Analyzer

1. Navigate to the ATS Analyzer page
2. Upload your resume (PDF, DOCX, or TXT)
3. View your ATS compatibility score
4. Review detailed breakdown and recommendations
5. Implement suggestions to improve your score

### Job Matcher

1. Navigate to the Job Matcher page
2. Upload your resume
3. Paste the job description
4. Click "Analyze Match"
5. Review match score, strengths, and gaps
6. Update your resume based on recommendations

## 🔐 Security Features

- **Environment Validation**: Required environment variables are validated at startup
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Error Boundaries**: React error boundaries prevent entire app crashes
- **TypeScript**: Full TypeScript support with strict type checking

## 🎨 Production Optimizations

- **Code Splitting**: Route-based lazy loading for optimal bundle sizes
- **Chunking**: Vendor, UI, and PDF libraries are split into separate chunks
- **Minification**: ESBuild minification for fast builds
- **Tree Shaking**: Unused code is eliminated
- **CSS Optimization**: PurgeCSS removes unused styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [OpenRouter](https://openrouter.ai) for AI capabilities
- [Shadcn/UI](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons

## 📞 Support

For support, email support@resumepilot.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Resume builder/editor
- [ ] Multiple resume versions
- [ ] Cover letter analysis
- [ ] Interview preparation tips
- [ ] Salary negotiation insights
- [ ] Career path recommendations
- [ ] Real-time collaboration
- [ ] Resume templates
- [ ] Industry-specific analysis
- [ ] LinkedIn integration
