const Screen = ({ title, pictures }) => {
  return (
    <div className="screen-container">
      {pictures.map((url, index) => (
        <img
          key={index}
          className="screen-container__pictures"
          src={url}
          alt={`${title} screenshot ${index + 1}`}
        />
      ))}
    </div>
  )
}

export default Screen
