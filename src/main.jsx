import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyTheme, useThemeStore } from './stores/themeStore';
import { TeensGameProvider } from './context/TeensGameContext';

// Apply persisted theme before first paint to avoid a flash of the wrong theme.
applyTheme(useThemeStore.getState().theme);

// Keep in sync with the operating system while the user hasn't chosen a theme manually.
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
  if (!window.localStorage.getItem('kdice-theme')) {
    useThemeStore.getState().setTheme(e.matches ? 'dark' : 'light');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TeensGameProvider>
      <App />
    </TeensGameProvider>
  </StrictMode>,
)
