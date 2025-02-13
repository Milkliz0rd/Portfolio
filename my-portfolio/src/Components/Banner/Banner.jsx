import React from 'react'
import Navigation from '../Navigation/Navigation'
import Logo from '../Logo/Logo'

const Banner = () => {
  return (
    <div className="banner">
      <Navigation />
      <div className="banner__title">Alexandre Morozoff</div>
      <Logo />
    </div>
  )
}

export default Banner
