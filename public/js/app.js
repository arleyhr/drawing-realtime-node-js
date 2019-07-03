document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
    let mouse = {
        pressed: false,
        moving: false,
        pos: {
            x: 0,
            y: 0
        },
        prevPos: false
    }

    const $canvas = document.querySelector('#canvas')
    const $colors = document.querySelectorAll('#colors button')
    const context = $canvas.getContext('2d')
    const width = window.innerWidth;
    const height = window.innerHeight
    let currentColor = colors[Math.floor(Math.random() * colors.length)]

    const socket = io()

    $canvas.width = width
    $canvas.height = height

    $canvas.onmousedown = () => {
        mouse.pressed = true
    }

    $canvas.onmouseup = () => {
        mouse.pressed = false
    }

    $canvas.ontouchstart = () => {
        mouse.pressed = true
    }

    $canvas.ontouchend = () => {
        mouse.pressed = false
    }

    $canvas.onmousemove = e => {
        mouse.pos.x = e.clientX / width
        mouse.pos.y = e.clientY / height
        mouse.pos.color = currentColor
        mouse.moving = true
    }
    $canvas.ontouchmove = e => {
        mouse.pos.x = e.touches[0].clientX / width
        mouse.pos.y = e.touches[0].clientY / height
        mouse.pos.color = currentColor
        mouse.moving = true
    }

    function mainLoop () {
        if (mouse.pressed && mouse.moving && mouse.prevPos) {
            socket.emit('draw_line', {
                line: [mouse.pos, mouse.prevPos]
            })
            mouse.moving = false
        }
        mouse.prevPos = {
            x: mouse.pos.x,
            y: mouse.pos.y,
            color: currentColor
        }

        setTimeout(mainLoop, 25)
    }

    mainLoop()

    socket.on('connect', () => {
        console.log('connected')
    })

    socket.on('draw_line', ({ line }) => {
        context.beginPath()
        context.moveTo(line[0].x * width, line[0].y * height)
        context.lineTo(line[1].x * width, line[1].y * height)
        context.strokeStyle = line[0].color
        context.stroke()
    })

    socket.on('disconnected', () => {
        console.log('disconnected')
    })

    $colors.forEach($color => {
        $color.addEventListener('click', e => {
            currentColor = e.target.dataset.color
        })
    })
})
