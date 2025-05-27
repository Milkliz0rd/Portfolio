import Navigation from '../Navigation/Navigation.jsx'

const Layout = ({ children }) => {
  return (
    <div className="page-structure">
      <Navigation />
      <div className="page-content">{children}</div>
    </div>
  )
}

export default Layout
