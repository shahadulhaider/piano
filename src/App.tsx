import { ThemeProvider } from '@/components/ThemeProvider'
import { PianoKeyboard } from '@/components/PianoKeyboard'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="piano-theme">
      <PianoKeyboard />
    </ThemeProvider>
  )
}

export default App
