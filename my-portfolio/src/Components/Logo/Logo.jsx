const Logo = () => {
  return (
    <div className="logo">
      <a className="logo__link" href="https://github.com/Milkliz0rd">
        <img
          className="logo__link--git"
          src="/Assets/Images/logo/github.png"
          alt="Logo github"
        />
      </a>
      <a href="https://x.com/Milkliz0rd" className="logo__link">
        <img
          className="logo__link--x"
          src="/Assets/Images/logo/x.png"
          alt="Logo x"
        />
      </a>
      <a href="#">
        <img
          className="logo__link--linkedin"
          src="/Assets/Images/logo/linkedin.png"
          alt="Logo linkedin"
        />
      </a>
    </div>
  )
}

export default Logo
