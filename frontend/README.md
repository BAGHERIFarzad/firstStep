# FirstStep Frontend

A beautiful, modern React frontend for FirstStep - an AI-powered code analysis tool.

## Features

✨ **Beautiful UI** - Modern, responsive design with Tailwind CSS
🌓 **Dark/Light Mode** - Seamless theme switching
📊 **Comprehensive Analysis** - View code summaries, components, tests, and documentation
📜 **History Tracking** - Save and revisit previous analyses
📥 **Export Options** - Export results to PDF or Markdown
🎨 **Stunning Animations** - Smooth transitions and engaging user experience

## Tech Stack

- **React 19** - Latest React with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **jsPDF** - PDF generation
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the API URL in `.env` if needed:
```
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # App header with theme toggle
│   │   ├── Hero.tsx         # Hero section with stories
│   │   ├── CodeInput.tsx    # Code input with language selector
│   │   ├── Results.tsx      # Results display with tabs
│   │   └── HistorySidebar.tsx # History sidebar
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx # Theme management
│   ├── services/            # API services
│   │   └── api.ts           # Backend API integration
│   ├── utils/               # Utility functions
│   │   └── exportUtils.ts   # PDF/Markdown export
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## Key Components

### Hero Section
Tells the stories of Henri (senior developer) and Amina (junior developer) to showcase the value proposition.

### Code Input
- Language selector with 10+ programming languages
- Large textarea for code input
- Paste from clipboard functionality
- Character and line count

### Results Display
Tabbed interface showing:
- **Summary** - AI-generated code overview
- **Components** - Identified components with complexity ratings
- **Tests** - Suggested test cases with code examples
- **Documentation** - Generated documentation

### History Sidebar
- Saves last 20 analyses
- Quick access to previous results
- Clear history option
- Responsive design (drawer on mobile)

### Export Features
- **PDF Export** - Professional formatted PDF with all analysis details
- **Markdown Export** - Markdown file for documentation

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### API Integration
The app can work with mock data for testing. Set `USE_MOCK_API = true` in `App.tsx`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
