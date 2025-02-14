import projets from '../../Data/Projets.json'
import { NavLink } from 'react-router-dom'

const Arcades = () => {
  return (
    <div className="arcade-page">
      <div className="arcade-page__title">
        Cliquez sur chaques bornes pour
        <br /> déverouiller les compétences
      </div>
      <div className="arcade-container">
        {projets.map((projet) => (
          <NavLink
            key={projet.id}
            to={`/competence/${projet.id}`}
            className={'arcade-container__navlink'}
            state={{ projet }}
          >
            <article className="arcade-container__navlink--article">
              <img
                className="article__arcade"
                src={projet.arcade}
                alt={`arcade pour la compétence ${projet.title}`}
              />
              <p className="article__title">{projet.title}</p>
            </article>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Arcades
