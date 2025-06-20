import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Checked from '/Assets/Images/logo/checked.webp'

const ArcadeItem = ({ projet }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisited, setIsVisited] = useState(false)

  useEffect(() => {
    const compVisited = JSON.parse(localStorage.getItem('xpProgress')) || {}

    if (compVisited[projet.title]) {
      setIsVisited(true)
    }
  }, [projet.title])
  return (
    <div className="carousel__slide">
      <NavLink
        className={'carousel__slide--link'}
        to={`/competence/${projet.id}`}
        state={{ projet }}
      >
        <img
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`carousel__slide--img ${isVisited ? 'visited' : ''}`}
          src={isHovered ? projet.arcade.open : projet.arcade.close}
          alt={`Arcade du projet ${projet.title}`}
          width={300}
          height={300}
        />
        {isVisited && (
          <img
            src={Checked}
            alt="Compétence terminée"
            className="badge-check"
          />
        )}
      </NavLink>
    </div>
  )
}

export default ArcadeItem
