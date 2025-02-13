import React from 'react'

const Welcome = () => {
  return (
    <div className="start-page">
      <h1 className="start-page__title">Alexandre Morozoff</h1>
      <h2 className="start-page__subtitle">Développeur Front-end junior</h2>
      <div className="start-page__bulle">
        <p className="start-page__bulle--p">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
          recusandae ducimus dolor perferendis distinctio eum, assumenda
          accusantium tempora vel similique nihil ex consequuntur maxime
          temporibus magnam! Totam iste iure dolorem?
        </p>
      </div>
      <div className="start-page__btn">
        <button className="start-page__btn--start">START</button>
      </div>
      <div className="start-page__footer">
        <img
          className="start-page__footer--git"
          src="/Assets/Images/logo/github.png"
          alt="Logo github"
        />
        <img
          className="start-page__footer--x"
          src="/Assets/Images/logo/x.png"
          alt="Logo x"
        />
        <img
          className="start-page__footer--linkedin"
          src="/Assets/Images/logo/linkedin.png"
          alt="Logo linkedin"
        />
      </div>
    </div>
  )
}

export default Welcome
