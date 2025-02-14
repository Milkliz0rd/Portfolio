import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/Index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './Pages/StartPage'
import ArcadeRoom from './Pages/ArcadeRoom'
import About from './Pages/About'
import Skills from './Pages/Skills'
import Layout from './Components/Layout/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/arcade"
          element={
            <Layout>
              <ArcadeRoom />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/competence/:projetId"
          element={
            <Layout>
              <Skills />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
