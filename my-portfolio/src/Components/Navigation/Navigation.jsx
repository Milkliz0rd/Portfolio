import { NavLink } from 'react-router-dom'
import Menu from '../../Assets/icon/menu.svg'
const Navigation = () => {
  return (
    <div className="nav-banner">
      <section className="nav-banner__menu-section">
        <div className="nav-banner__burger">
          <img
            className="nav-banner__burger--logo"
            src={Menu}
            alt="logo menu"
          />
        </div>
        <NavLink to={'/arcade'} className={'nav-banner__link'}>
          Salle <br /> d`arcade
        </NavLink>
        <NavLink to={'/About'} className={'nav-banner__link'}>
          Contact
        </NavLink>
      </section>

      <li>
        <div className="nav-banner__title">ALEXANDRE MOROZOFF</div>
      </li>
      <li className="nav-banner__logo">
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
      </li>
      <li className="nav-banner__logo">
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
      </li>
      <li className="nav-banner__logo">
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
      </li>
    </div>
  )
}

export default Navigation
