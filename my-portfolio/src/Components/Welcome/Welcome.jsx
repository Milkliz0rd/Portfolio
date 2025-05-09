import { NavLink } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className="start-page">
      <h1 className="start-page__title">Alexandre Morozoff</h1>
      <h2 className="start-page__subtitle">Développeur Front-end junior</h2>
      <div className="start-page__bulle">
        <p className="start-page__bulle--p">
          <strong>BONJOUR ET BIENVENUE SUR MON PORTFOLIO INTERACTIF !</strong>
          <br />
          <br />
          Je m’appelle <strong>Alexandre Morozoff</strong>, récemment diplômé du
          parcours <strong>Développeur Web</strong> chez OpenClassrooms, et
          futur étudiant en <strong>Bachelor Développeur Fullstack</strong> à
          l’école <strong>CODA Orléans</strong> à la rentrée 2025/2026.
          <br />
          <br />
          Je suis actuellement à la recherche d’une <strong>
            alternance
          </strong>{' '}
          qui me permettra de consolider mes compétences en entreprise tout en
          poursuivant ma formation.
          <br />
          <br />
          Ce portfolio vous propose une immersion dans mon univers à travers un
          site ludique, conçu comme un jeu interactif. Explorez les différentes{' '}
          <strong>bornes d’arcade</strong> pour découvrir mes compétences, mes
          projets, et mon parcours.
          <br />
          <br />
          Et une fois toutes les bornes explorées,{' '}
          <strong>vous débloquerez mon CV !</strong>
          <br />
          <br />
          Merci de votre visite et bonne exploration !
        </p>
      </div>
      <NavLink className="start-page__btn" to={'/arcade'}>
        <div className="start-page__btn--start">START</div>
      </NavLink>
      <div className="start-page__footer">
        <a href="https://github.com/Milkliz0rd" target="_blank">
          <img
            className="start-page__footer--git"
            src="/Assets/Images/logo/github.webp"
            alt="Logo github"
            height={64}
            width={64}
          />
        </a>
        <a href="https://x.com/Milkliz0rd" target="_blank">
          <img
            className="start-page__footer--x"
            src="/Assets/Images/logo/x.webp"
            alt="Logo x"
            height={64}
            width={64}
          />
        </a>
        <a
          href="https://linkedin.com/in/alexandre-morozoff-4b1386337"
          target="_blank"
        >
          <img
            className="start-page__footer--linkedin"
            src="/Assets/Images/logo/linkedin.webp"
            alt="Logo linkedin"
            height={64}
            width={64}
          />
        </a>
      </div>
    </div>
  )
}

export default Welcome
