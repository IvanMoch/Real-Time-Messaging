import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { pool } from '../db.js'

const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = new Server(server)

// recording the connection
io.on('connection', async (Socket) => {
  console.log('you are in')

  // recording the disconnection
  Socket.on('disconnect', async () => {
    console.log('you are out')
  })

  // sending the message to everybody
  Socket.on('chat message', async (message) => {
    let result
    let name

    try {
      name = Socket.handshake.auth.username ?? 'anonymous'
      result = await pool.query('insert into messages(content, username) value(?, ?)', [message, name], (error, value) => {
        if (error) {
          console.error(error)
          return false
        }

        return value.insertId
      })
    } catch (e) {
      console.error(e)
      return
    }
    if (result) {
      io.emit('chat message', message, result[0].insertId, name)
    }
  })

  // Recovering all the messages
  if (!Socket.recovered) {
    const result = await pool.query('select * from messages where id > ?', [Socket.handshake.auth.serverOffset])

    result[0].forEach(value => {
      Socket.emit('chat message', value.content, value.id, value.username)
    })
  }
})

app.use(logger('dev'))
app.use(express.static(process.cwd() + '/public'))

app.get('/', (req, res) => res.header('Access-Control-Allow-Origin', req.url).sendFile(process.cwd() + '/views/index.html'))

server.listen(PORT, () => {
  console.log('Example listening on http://localhost:' + PORT)
})
