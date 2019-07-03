const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = process.env.PORT || 3000
const app = express()

app.use(express.static(`${__dirname}/public`))
app.set('view engine', 'pug')

app.get('/', (_, res) => {
    return res.render('index')
})

const server = http.createServer(app)
const io = socketIO.listen(server)

server.listen(port)

let drawingLines = []

io.on('connection', socket => {
    drawingLines.forEach(line => {
        socket.emit('draw_line', { line })
    })

    socket.on('draw_line', ({ line }) => {
        drawingLines.push(line)

        io.emit('draw_line', { line })
    })
})

console.log(`Server running on http://localhost:${port}`)