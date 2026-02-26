import { Game } from './game'

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
const scoreElement = document.getElementById('score') as HTMLElement
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement

const game = new Game(canvas)

// Update score display
const updateScore = () => {
  scoreElement.textContent = String(game.getScore())
}

// Game loop
const gameLoop = () => {
  game.update()
  game.render()
  updateScore()
  requestAnimationFrame(gameLoop)
}

// Event listeners
document.addEventListener('keydown', (e) => {
  game.handleKeyPress(e.key)
})

pauseBtn.addEventListener('click', () => {
  game.togglePause()
  pauseBtn.textContent = game.isPaused() ? 'Resume' : 'Pause'
})

resetBtn.addEventListener('click', () => {
  game.reset()
  pauseBtn.textContent = 'Pause'
  updateScore()
})

// Start game
gameLoop()
updateScore()
