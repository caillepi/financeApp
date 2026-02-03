// theme.js
import { createTheme } from '@mui/material/styles';

// Palette "Bleu Électrique"
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#9CA3AF',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#3B82F6',
    },
    success: {
      main: '#10B981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;

// Fonction pour injecter les variables CSS
export function applyThemeToDocument(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary-main', theme.palette.primary.main);
  root.style.setProperty('--primary-contrastText', theme.palette.primary.contrastText);
  root.style.setProperty('--secondary-main', theme.palette.secondary.main);
  root.style.setProperty('--secondary-contrastText', theme.palette.secondary.contrastText);
  root.style.setProperty('--background-default', theme.palette.background.default);
  root.style.setProperty('--background-paper', theme.palette.background.paper);
  root.style.setProperty('--text-primary', theme.palette.text.primary);
  root.style.setProperty('--text-secondary', theme.palette.text.secondary);
  root.style.setProperty('--error-main', theme.palette.error.main);
  root.style.setProperty('--warning-main', theme.palette.warning.main);
  root.style.setProperty('--info-main', theme.palette.info.main);
  root.style.setProperty('--success-main', theme.palette.success.main);
}
