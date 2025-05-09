const Logo = () => {
  return (
    <div className="logo">
      <a
        className="logo__link"
        href="https://github.com/Milkliz0rd"
        target="_blank"
      >
        <img
          className="logo__link--git"
          src="/Assets/Images/logo/github.webp"
          alt="Logo github"
          height={32}
          width={32}
        />
      </a>
      <a href="https://x.com/Milkliz0rd" className="logo__link" target="_blank">
        <img
          className="logo__link--x"
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
          className="logo__link--linkedin"
          src="/Assets/Images/logo/linkedin.webp"
          alt="Logo linkedin"
          height={32}
          width={32}
        />
      </a>
    </div>
  )
}

export default Logo
