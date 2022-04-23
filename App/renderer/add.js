
const { ipcRenderer } = require('electron')

document.getElementById('todoForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const input = evt.target[0]
  const ip = evt.target[0].value
  const port = evt.target[1].value
  const username = evt.target[2].value
  const password = evt.target[3].value

  // console.log(evt.target[1].value);
  // send todo to main process
  ipcRenderer.send('add-todo',{ ip, port, username, password})

  // reset input
  evt.target[0].value = ''
  evt.target[1].value = ''
  evt.target[2].value = ''
  evt.target[3].value = ''
})
