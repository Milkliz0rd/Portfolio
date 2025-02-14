import React from 'react'

const Screen = ({ screen, title, pictures }) => {
  return (
    <div className="screen">
      <h2 className="screen__title">{title}</h2>
      <img
        className="screen__arcade"
        src={screen}
        alt="écran de la borne d'arcade"
      />
      <div className="screen__carrousel"></div>
    </div>
  )
}

export default Screen
