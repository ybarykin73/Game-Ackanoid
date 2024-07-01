const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameSped = 5
let interval = 0

let score = 0
let lives = 3

const ballRadius = 10
let xBall = canvas.width / 2
let yBall = canvas.height - 30
let dxBall = 2
let dyBall = -2

const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2

const brickRowCount = 4
const brikColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30
const bricks = []

for (let i = 0; i < brikColumnCount; i++) {
  bricks[i] = []
  for (let j = 0; j< brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1}
  }
}

let rightPressed = false
let leftPressed = false

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  drawLives()
  collisionDetection()

  if (xBall + dxBall > canvas.width - ballRadius || xBall + dxBall < ballRadius) {
    dxBall = -dxBall
  }
  
  if (yBall + dyBall < ballRadius) {
    dyBall = -dyBall
  } else if (yBall + dyBall + paddleHeight > canvas.height - ballRadius) {
    if (xBall > paddleX && xBall < paddleX + paddleWidth) {
      dyBall = -dyBall
    } else {
      lives--
      
      if (!lives) {
        console.log('ok')
        alert("GAME OVER")
        document.location.reload()
      } else {
        xBall = canvas.width / 2
        yBall = canvas.height - 30
        dxBall = 2
        dyBall = -2
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }

  xBall += dxBall
  yBall += dyBall

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth)
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0)
  }

  requestAnimationFrame(draw)
}

const drawBall = () => {
  ctx.beginPath()
  ctx.arc(xBall, yBall, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
}

const drawPaddle = () => {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const drawBricks = () => {
  for (let i = 0; i < brikColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {

      if (bricks[i][j].status === 1) {
        bricksX = i * (brickWidth + brickPadding) + brickOffsetLeft
        bricksY = j * (brickHeight + brickPadding) + brickOffsetTop
  
        bricks[i][j].x = bricksX
        bricks[i][j].y = bricksY
  
        ctx.beginPath()
        ctx.rect(bricksX, bricksY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

const drawScore = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Score: ${score}`, 8, 20)
}

const drawLives = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

const collisionDetection = () => {
  for (let i = 0; i < brikColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const b = bricks[i][j]

      if (b.status == 1) {
        if (
          xBall > b.x && 
          xBall < b.x + brickWidth && 
          yBall > b.y && 
          yBall < b.y + brickHeight
        ) {
            dyBall = -dyBall
            b.status = 0
            score++
            if (score === brickRowCount * brikColumnCount) {
              alert('YOU WIN, CONGRATULATIONS!')
              document.location.reload()
            }
          }
      }
    }
  }
}

const startGame = () => {
  draw()
}

const keyDownHandler = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = true
  } else if (e.key === "ArrowLeft") {
    leftPressed = true
  }
}

const keyUpHandler = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = false
  } else if (e.key === "ArrowLeft") {
    leftPressed = false
  }
}

const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false )

document.getElementById('start-button').addEventListener('click', () => {
  startGame()
})
