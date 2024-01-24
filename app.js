const express = require('express');
const path = require('path');
const sql = require('sqlite3');

const PORT = 8000

const app = express();
const db = new sql.Database('data.db')

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html'))
})
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/game.html'))
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'))
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'))
})

app.post('/login', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})