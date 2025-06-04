import ArcadeItem from '../ArcadeItem/ArcadeItem'
import Carousel from '../Carousel/Carousel'

const Arcades = () => {
  return (
    <div className="arcade-page">
      <div className="arcade-page__title">
        Cliquez sur chaques bornes pour
        <br /> déverouiller les compétences
      </div>
      <div className="arcade-container" style={{ display: 'none' }}>
        <Carousel />
        {/* // <ArcadeItem key={projet.id} projet={projet} /> */}
      </div>
    </div>
  )
}

export default Arcades
