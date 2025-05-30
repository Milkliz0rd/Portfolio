import projets from '../../Data/Projets.json'
import ArcadeItem from '../ArcadeItem/ArcadeItem'

const Arcades = () => {
  return (
    <div className="arcade-page">
      <div className="arcade-page__title">
        Cliquez sur chaques bornes pour
        <br /> déverouiller les compétences
      </div>
      <div className="arcade-container">
        {projets.map((projet) => (
          <ArcadeItem key={projet.id} projet={projet} />
        ))}
      </div>
    </div>
  )
}

export default Arcades
