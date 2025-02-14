import React from 'react'
import Screen from '../Components/Screen/Screen'
import { useLocation, useParams } from 'react-router-dom'

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
    </div>
  )
}

export default Skills
