import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const socket = io({
  auth: {
    username: await getRandomUsername(),
    serverOffset: 0,
    recovered: false
  }
})

const form = document.querySelector('form')
const userInput = document.querySelector('input')
const message = document.querySelector('#messages')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (userInput.value) {
    socket.emit('chat message', userInput.value)
    userInput.value = ''
  }
})

// show the message in the screen
socket.on('chat message', (msg, serverOffset, username) => {
  const item = `<li>${msg} -> ${username}</li>`
  message.insertAdjacentHTML('beforeend', item)
  socket.auth.serverOffset = serverOffset
  socket.auth.username = username
})

async function getRandomUsername () {
  const response = await fetch('https://randomuser.me/api/')
  const data = await response.json()
  const username = data.results[0].login.username
  return username
}
