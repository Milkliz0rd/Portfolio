import React from 'react'
import { NavLink } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className="start-page">
      <h1 className="start-page__title">Alexandre Morozoff</h1>
      <h2 className="start-page__subtitle">Développeur Front-end junior</h2>
      <div className="start-page__bulle">
        <p className="start-page__bulle--p">
          Je me présente, je suis Alexandre Morozoff et bienvenue sur mon
          portfolio en ligne.Tout juste finissant du parcours Developpeur Web de
          la plateforme OpenClassroom, me voilà dans la grande jungle des
          developpeurs juniors. Au cours de mon parcours, j’ai pu développer
          plusieurs compétences que je vous présente ici au travers de ce site
          interractif. Parcourez les différentes Bornes d’arcades pour en savoir
          plus sur mon parcours.Enfin une fois que vous les aurez toutes visités
          mon CV pourra être débloqués.
          <br />
          Bonne Visite !
        </p>
      </div>
      <div className="start-page__btn">
        <NavLink to={'/arcade'}>
          <button className="start-page__btn--start">Start</button>
        </NavLink>
      </div>
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
