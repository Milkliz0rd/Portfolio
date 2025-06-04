import { NavLink } from 'react-router-dom'
import Menu from '../../Assets/icon/menu.svg'
import { useState } from 'react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(false)
  }
  return (
    <div className="nav-banner">
      <section className={`nav-banner__menu-section ${isOpen ? 'active' : ''}`}>
        <NavLink
          to={'/arcade'}
          className={`nav-banner__link`}
          onClick={handleClick}
        >
          Salle <br /> d`arcade
        </NavLink>
        <NavLink
          to={'/About'}
          className={`nav-banner__link`}
          onClick={handleClick}
        >
          Contact
        </NavLink>
      </section>
      <div
        className={`nav-banner__burger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={Menu} alt="logo menu en responsive" />
      </div>
      <div className="nav-banner__title">
        <div className="nav-banner__title--titre">ALEXANDRE MOROZOFF</div>
      </div>
      <div className={`nav-banner__logo ${isOpen ? 'active' : ''}`}>
        <a
          className="nav-banner__logo--link"
          href="https://github.com/Milkliz0rd"
          target="_blank"
          onClick={handleClick}
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
          onClick={handleClick}
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
          className="nav-banner__logo--link"
          target="_blank"
          onClick={handleClick}
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
