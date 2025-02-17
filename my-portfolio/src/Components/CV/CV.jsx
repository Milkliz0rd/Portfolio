import React from 'react'
import money from '/Assets/Images/logo/money-cv.gif'

const CV = () => {
  return (
    <div>
      <h2>Mon cv:</h2>
      <a
        href="https://drive.google.com/uc?export=download&id=1ESJAqUlQhx3TubGYSBI1bJMIg6qLjuw_"
        download={'Alexandre_Morozoff_CV'}
      >
        <img src={money} alt="Télécharger le cv" />
      </a>
    </div>
  )
}

export default CV
