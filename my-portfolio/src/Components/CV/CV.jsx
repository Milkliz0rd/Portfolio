import money from '/Assets/Images/logo/CV.webp'

const CV = () => {
  return (
    <div className="cv">
      <h2 className="cv__title">Mon cv:</h2>
      <a
        href="https://drive.google.com/uc?export=download&id=1ngtPEaUWjD0raJZFQlneLKWsI0mwrenj"
        download={'Alexandre_Morozoff_CV'}
      >
        <img
          className="cv__gif"
          height={200}
          width={150}
          src={money}
          alt="Télécharger le cv"
        />
      </a>
    </div>
  )
}

export default CV
