import Banner from '../Banner/Banner.jsx'

const Layout = ({ children }) => {
  return (
    <div className="page-structure">
      <Banner />
      <div className="page-content">{children}</div>
    </div>
  )
}

export default Layout
