import { NavLink } from 'react-router-dom'
import Menu from '../../Assets/icon/menu.svg'
import { useState } from 'react'
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="nav-banner">
      <div className="nav-banner__burger" onClick={() => setIsOpen(!isOpen)}>
        <img className="nav-banner__burger--logo" src={Menu} alt="logo menu" />
      </div>
      <section className="nav-banner__menu-section">
        <NavLink
          to={'/arcade'}
          className={`nav-banner__link ${isOpen ? 'active' : ''}`}
        >
          Salle <br /> d`arcade
        </NavLink>
        <NavLink
          to={'/About'}
          className={`nav-banner__link ${isOpen ? 'active' : ''}`}
        >
          Contact
        </NavLink>
      </section>

      <div className="nav-banner__title">
        <div className="nav-banner__title--titre">ALEXANDRE MOROZOFF</div>
      </div>
      <div className="nav-banner__logo">
        <a
          className="nav-banner__logo--link"
          href="https://github.com/Milkliz0rd"
          target="_blank"
        >
          <img
            className="nav-banner__logo--link-git"
            src="/Assets/Images/logo/github.webp"
            alt="Logo github"
            height={32}
            width={32}
          />
        </a>
        <a
          href="https://x.com/Milkliz0rd"
          className="nav-banner__logo--link"
          target="_blank"
        >
          <img
            className="nav-banner__logo--link-x"
            src="/Assets/Images/logo/x.webp"
            alt="Logo x"
            height={32}
            width={32}
          />
        </a>
        <a
          href="https://linkedin.com/in/alexandre-morozoff-4b1386337"
          target="_blank"
        >
          <img
            className="nav-banner__logo--link-linkedin"
            src="/Assets/Images/logo/linkedin.webp"
            alt="Logo linkedin"
            height={32}
            width={32}
          />
        </a>
      </div>
    </div>
  )
}

export default Navigation
