import { useState, useEffect } from 'react'

const competences = [
  'HTML & CSS',
  'JavaScript',
  'React',
  'Node.js',
  'Optimisation & Debug',
  'Gestion de projet',
]

export default function ExperienceBar({ activeCompetence, onFullProgress }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('xpProgress')) || {}

    if (activeCompetence && !storedProgress[activeCompetence]) {
      storedProgress[activeCompetence] = true
      localStorage.setItem('xpProgress', JSON.stringify(storedProgress))
    }

    const visitedCount = Object.keys(storedProgress).length
    const newProgress = (visitedCount / competences.length) * 100
    setProgress(newProgress)

    if (newProgress === 100) {
      onFullProgress(true)
    }
  }, [activeCompetence, onFullProgress])
  return (
    <div>
      <p>Barre d'xp</p>
      <div className="xp-container">
        <div className="xp-bar" style={{ width: `${progress}%` }}></div>
        <span className="xp-label">
          Barre d'expérience ({Math.round(progress)}%)
        </span>
      </div>
    </div>
  )
}
