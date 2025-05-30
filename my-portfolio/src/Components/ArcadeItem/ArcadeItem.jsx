import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const ArcadeItem = ({ projet }) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <NavLink
      key={projet.id}
      to={`/competence/${projet.id}`}
      className={'arcade-container__navlink'}
      state={{ projet }}
    >
      <article
        className="arcade-container__navlink--article"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          height={400}
          width={400}
          className="article__arcade"
          src={isHovered ? projet.arcade.open : projet.arcade.close}
          alt={`arcade pour la compétence ${projet.title}`}
        />
      </article>
    </NavLink>
  )
}

export default ArcadeItem
