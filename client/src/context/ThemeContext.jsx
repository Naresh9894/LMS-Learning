import { createContext, useContext, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true)
  const toggleTheme = () => setIsDark(p => !p)

  // ── Page content colors (NOT navbar/footer — they always stay navy) ──────
  const pageTheme = {
    isDark,
    bg:          isDark ? '#050d1a' : '#f8f6f0',
    bgCard:      isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
    bgCardHover: isDark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    border:      isDark ? 'rgba(212,168,67,0.18)' : 'rgba(212,168,67,0.3)',
    text:        isDark ? '#f0e6cc' : '#1a1a2e',
    textSec:     isDark ? '#a8b8d0' : '#4a5568',
    textMuted:   isDark ? '#5a7a9a' : '#718096',
    inputBg:     isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    shadow:      isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, pageTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const usePageTheme = () => useContext(ThemeContext)