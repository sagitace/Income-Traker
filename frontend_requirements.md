# Frontend Package Dependencies

```json
{
  "name": "income-tracker-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0",
    "react-icons": "^4.12.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2"
  }
}
```

## Key Libraries

### Core

- **react** & **react-dom**: UI framework
- **react-router-dom**: Client-side routing
- **axios**: HTTP client

### UI & Styling

- **tailwindcss**: Utility-first CSS framework
- **react-icons**: Icon library

### Data Visualization

- **chart.js**: Charting library
- **react-chartjs-2**: React wrapper for chart.js

### Development

- **vite**: Fast build tool
- **eslint**: Code quality

## Installation

```bash
npm install
```

## Build

```bash
npm run build  # Production build
npm run dev    # Development server
npm run preview # Preview production build
```
