import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type AccentTheme = 'neutral' | 'ocean' | 'violet' | 'forest' | 'sunset'
export type ColorMode = 'light' | 'dark'

type ThemeContextValue = {
  accent: AccentTheme
  mode: ColorMode
  setAccent: (theme: AccentTheme) => void
  setMode: (mode: ColorMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const ACCENT_KEY = 'cadence-accent'
const MODE_KEY = 'cadence-mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AccentTheme>(() =>
    (localStorage.getItem(ACCENT_KEY) as AccentTheme | null) ?? 'neutral',
  )
  const [mode, setMode] = useState<ColorMode>(() =>
    (localStorage.getItem(MODE_KEY) as ColorMode | null) ?? 'light',
  )

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = accent
    root.dataset.mode = mode
    localStorage.setItem(ACCENT_KEY, accent)
    localStorage.setItem(MODE_KEY, mode)
  }, [accent, mode])

  const value = useMemo(() => ({ accent, mode, setAccent, setMode }), [accent, mode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
