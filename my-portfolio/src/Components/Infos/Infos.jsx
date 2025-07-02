import { useEffect, useState } from 'react'

const Infos = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    sujet: '',
    text: '',
  })

  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    console.log('URL API :', import.meta.env.VITE_API_URL)
  }, [])

  const handleChange = (e) => {
    // On récupère l'événement déclenché par la saisie dans un champ du formulaire
    const { name, value } = e.target
    // 'name' correspond à l'attribut name de l'input (ex: "email")
    // 'value' correspond à ce que l'utilisateur a tapé
    setFormData((prevData) => ({
      // On garde les anciennes valeurs de formData
      ...prevData,
      // On met à jour uniquement la propriété correspondant au champ modifié
      // Par exemple : si name = "email", alors on fait email: "valeur tapée"
      [name]: value, // Ici, on fait de la notation dynamique d'objet en JS
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi")
      }

      const data = await response.json()
      console.log('✅ Réponse du serveur :', data.message)
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        sujet: '',
        text: '',
      })
      setSendingMessage(true)
      setTimeout(() => {
        setSendingMessage(false)
      }, 5000)
    } catch (error) {
      console.error('❌ Erreur:', error.message)
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 5000)
    }
  }

  return (
    <div className="contact-box">
      <h2 className="contact-box__title">Vous voulez me contacter ?</h2>
      <form onSubmit={handleSubmit} className="contact-box__form">
        <label htmlFor="nom" className="contact-box__form--label">
          Nom:
          <br />
          <input
            id="nom"
            name="nom"
            type="text"
            className="contact-box__form--input"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="prenom" className="contact-box__form--label">
          Prénom:
          <br />
          <input
            id="prenom"
            name="prenom"
            type="text"
            className="contact-box__form--input"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="email" className="contact-box__form--label">
          Email:
          <br />
          <input
            id="email"
            name="email"
            type="email"
            className="contact-box__form--input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="sujet" className="contact-box__form--label">
          Sujet de la demande:
          <br />
          <input
            id="email"
            name="sujet"
            type="text"
            className="contact-box__form--input"
            value={formData.sujet}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="text" className="contact-box__form--label">
          votre demande:
          <br />
          <textarea
            id="text"
            name="text"
            className="contact-box__form--text"
            value={formData.text}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <button type="submit" className="contact-box__form--button">
          Envoyer
        </button>
        <div
          className={`contact-box__message ${sendingMessage ? 'visible' : ''}`}
        >
          <p className="contact-box__message--success">
            Merci pour votre message, j'y répondrais dans les plus bref délais.
          </p>
        </div>
        <div className={`contact-box__error ${error ? 'visible' : ''}`}>
          <p className="contact-box__error--message">
            ⚠️ Une erreur est survenue. Veuillez réessayer. ⚠️
          </p>
        </div>
      </form>
    </div>
  )
}

export default Infos
