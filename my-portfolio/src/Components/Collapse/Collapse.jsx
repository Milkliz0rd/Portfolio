import { useState } from 'react'
import hand from '/Assets/Images/logo/hand.webp'

const Collapse = ({ descriptions, link }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="collapse">
      <div className="collapse__header">
        <h3 className="collapse__header--title">Ce projet m'a appris:</h3>
        <img
          src={hand}
          alt="Main pour ouvrir la collapse"
          className={`collapse__header--btn
          ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className={`collapse__content ${isOpen ? 'open' : ''}`}>
          <ul>
            {descriptions.map((description, index) => (
              <li className="collapse__content--description" key={index}>
                {description}
              </li>
            ))}
            {link && (
              <li>
                Le lien GitHub du projet :{' '}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  ici
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Collapse
