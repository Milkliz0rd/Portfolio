import { useState } from 'react'
import arrow from '../../Assets/icon/arrow.webp'
const Screen = ({ screen, title, pictures }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  function showPicture() {
    return (
      <img
        height={560}
        width={528}
        src={pictures[currentIndex]}
        alt={title}
        className="screen__carrousel--img"
      />
    )
  }
  function prevPicture() {
    setCurrentIndex((currentIndex - 1 + pictures.length) % pictures.length)
  }
  function nextPicture() {
    setCurrentIndex((currentIndex + 1) % pictures.length)
  }
  return (
    <div className="screen">
      <h2 className="screen__arcade--title">{title}</h2>
      <img
        width={1096}
        height={1280}
        className="screen__arcade"
        src={screen}
        alt="écran de la borne d'arcade"
      />
      <div className="screen__carrousel">
        {showPicture()}
        <p className="screen__carrousel--index">
          {currentIndex + 1}/{pictures.length}
        </p>
        <img
          src={arrow}
          alt="flèche gauche"
          onClick={prevPicture}
          className="screen__carrousel--arrow-left"
          height={32}
          width={32}
        />
        <img
          src={arrow}
          alt="flèche droite"
          onClick={nextPicture}
          className="screen__carrousel--arrow-right"
          height={32}
          width={32}
        />
      </div>
    </div>
  )
}

export default Screen
