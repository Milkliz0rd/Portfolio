import React from 'react'
import Screen from '../Components/Screen/Screen'
import { useLocation, useParams } from 'react-router-dom'
import Collapse from '../Components/Collapse/Collapse.jsx'

const Skills = () => {
  const { projetId } = useParams()
  const { state } = useLocation()
  const projet = state.projet
  return (
    <div>
      <Screen
        screen={projet.screen}
        title={projet.title}
        pictures={projet.pictures}
      />
      <div>
        <Collapse descriptions={projet.descriptions} link={projet.gitLink} />
      </div>
    </div>
  )
}

export default Skills
