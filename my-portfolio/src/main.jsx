import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/Index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './Pages/StartPage'
import ArcadeRoom from './Pages/ArcadeRoom'
import About from './Pages/About'
import Skills from './Pages/Skills'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/arcade" element={<ArcadeRoom />} />
        <Route path="/about" element={<About />} />
        <Route path="/competence" element={<Skills />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
