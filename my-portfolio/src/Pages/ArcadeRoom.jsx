import React, { useState } from 'react'
import Arcades from '../Components/Arcades/Arcades'
import CV from '../Components/CV/cv'
import ExperienceBar from '../Components/ExperienceBar/ExperienceBar'
import projet from '../Data/Projets.json'

const ArcadeRoom = () => {
  const [isFullXP, setIsFullXP] = useState(false)
  return (
    <div>
      <Arcades />
      <ExperienceBar
        onFullProgress={setIsFullXP}
        activeCompetence={projet.title}
      />
      {isFullXP && <CV />}
    </div>
  )
}

export default ArcadeRoom
