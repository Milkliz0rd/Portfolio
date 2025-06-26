import money from '/Assets/Images/logo/CV.webp'

const CV = () => {
  return (
    <div className="cv">
      <h2 className="cv__title">Mon cv:</h2>
      <a
        href="/Files/CV_Alternance Alexandre_Morozoff_dev_FullStack.pdf"
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
