import React from 'react'
import { NavLink } from 'react-router-dom'
const Navigation = () => {
  return (
    <ul className="nav-banner">
      <li>
        <NavLink to={'/arcade'} className={'nav-banner__link'}>
          Salle <br /> d'arcade
        </NavLink>
      </li>
      <li>
        <NavLink to={'/About'} className={'nav-banner__link'}>
          Contact
        </NavLink>
      </li>
    </ul>
  )
}

export default Navigation
