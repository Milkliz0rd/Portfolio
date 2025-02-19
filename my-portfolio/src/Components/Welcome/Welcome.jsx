import React from 'react'
import { NavLink } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className="start-page">
      <h1 className="start-page__title">Alexandre Morozoff</h1>
      <h2 className="start-page__subtitle">Développeur Front-end junior</h2>
      <div className="start-page__bulle">
        <p className="start-page__bulle--p">
          Je me présente, je suis Alexandre Morozoff, et bienvenue sur mon
          portfolio en ligne. Tout juste diplômé du parcours Développeur Web sur
          la plateforme OpenClassrooms, me voilà prêt à affronter la grande
          jungle des développeurs juniors. Au cours de mon apprentissage, j’ai
          acquis plusieurs compétences que je vous invite à découvrir à travers
          ce site interactif. Parcourez les différentes bornes d’arcade pour en
          savoir plus sur mon parcours. Une fois toutes explorées, vous pourrez
          débloquer mon CV.
          <br />
          Bonne visite !
        </p>
      </div>
      <NavLink className="start-page__btn" to={'/arcade'}>
        <div className="start-page__btn--start">START</div>
      </NavLink>
      <div className="start-page__footer">
        <img
          className="start-page__footer--git"
          src="/Assets/Images/logo/github.png"
          alt="Logo github"
        />
        <img
          className="start-page__footer--x"
          src="/Assets/Images/logo/x.png"
          alt="Logo x"
        />
        <img
          className="start-page__footer--linkedin"
          src="/Assets/Images/logo/linkedin.png"
          alt="Logo linkedin"
        />
      </div>
    </div>
  )
}

export default Welcome
