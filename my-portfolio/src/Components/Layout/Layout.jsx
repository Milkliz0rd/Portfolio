import React from 'react'
import Banner from '../Banner/Banner.jsx'

const Layout = ({ children }) => {
  return (
    <div className="page-structure">
      <div className="page-content">
        <Banner />
        {children}
      </div>
    </div>
  )
}

export default Layout
