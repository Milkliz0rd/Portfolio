// 1) Import des modules
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const nodemailer = require('nodemailer')

// 2) initialisation de l'app
const app = express()
const port = process.env.Port || 5000

// 3) Middleware pour lire le JSON et aurtoriser les requêtes externes (cors)
app.use(express.json())
app.use(cors())

// 4) Route de test
app.get('/', (req, res) => {
  res.send(`Le serveur fonctionne ! 🔥`)
})
app.post('/contact', (req, res) => {
  const { nom, prenom, email, sujet, text } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.DEST_EMAIL,
    subject: sujet,
    text: `
      message de : ${prenom} ${nom}
      Email: ${email}
      Sujet: ${sujet}

      ${text}
    `,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Erreur envoi mail :', error)
      return res.status(500).json({ message: "Échec de l'envoie du message" })
    }
    console.log('✅ Email envoyé :', info.response)
    res.status(200).json({ message: 'Message envoyé avec succés !' })
  })
})

// 5) lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`)
})
