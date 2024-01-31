const express = require('express')
const { copyFileSync } = require('fs')
const path = require('path')
const sql = require('sqlite3')
const uuid = require("uuid")

const PORT = 8000

const app = express()
const db = new sql.Database('data.db')

const sessions = new Map()

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
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leaderboard.html'))
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const stmt = "SELECT * FROM user WHERE name = ? AND password = ?"

  db.get(stmt, username, password, function (err, row) {
    if (err){
      res.json({
        error: err.code,
        session: null
      })
    }else{
      if (!row){
        res.json({
          error: "WRONG PASSWORD",
          session: null
        })
        return
      }
      const id = row.id
      const session = uuid.v4()
      
      sessions.set(session, id) 
      
      res.json({
        error: null,
        session: session
      })
    }
  })
})

app.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const stmt = "INSERT INTO user (name, password, score) VALUES (?, ?, 0)"

  db.run(stmt, username, password, function (err) {
    if (err){
      res.json({
        error: err.code,
        session: null
      })
    }else{
      const id = this.lastID
      const session = uuid.v4()
      
      sessions.set(session, id) 
      
      res.json({
        error: null,
        session: session
      })
    }
  })
})

app.post('/user', (req, res) => {
  const session = req.body.session
  const id = sessions.get(session)

  if (id == undefined){
    res.json({
      error: "NOT FOUND",
      user: null
    })
    return
  }

  const stmt = "SELECT * FROM user WHERE id = ?"

  db.get(stmt, id, function (err, row) {
    if (err){
      res.json({
        error: err.code,
        user: null
      })
    }else{
      res.json({
        error: null,
        user: {
          username: row.name,
          score: row.score
        }
      })
    }
  })
})

app.post('/leaderboard', (req, res) => {
  const stmt = "SELECT name, score FROM user"

  db.all(stmt, function (err, rows) {
    if (err){
      res.json({
        error: err,
        list: null
      })
    }else{
      rows.sort((a, b) => {
        if (a.score > b.score){
          return -1
        }else if (a.score < b.score){
          return 1
        }else{
          return (a.name < b.name ? -1 : 1)
        }
      })
      rows = rows.slice(0, Math.min(10, rows.length))


      res.json({
        error: null,
        list: rows
      })
    }
  })
})

app.post('/score', (req, res) => {
  const session = req.body.session
  const id = sessions.get(session)

  if (id == undefined){
    res.json({
      error: "NOT FOUND",
    })
    return
  }

  let score = req.body.score

  let stmt = "SELECT * FROM user WHERE id = ?"
  db.get(stmt, id, function (err, row) {
    if (err){
      res.json({
        error: err.code,
      })
      return
    }else{
      score = Math.max(score, row.score)

      stmt = "UPDATE user SET score = ? WHERE id = ?"
      db.run(stmt, score, id, function (err) {
        if (err){
          res.json({
            error: err.code,
          })
        }else{
          res.json({
            error: null,
          })
        }
      })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
