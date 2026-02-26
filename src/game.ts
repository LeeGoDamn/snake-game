export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gridSize: number = 20
  private tileCount: number
  private snake: { x: number; y: number }[] = []
  private food: { x: number; y: number } | null = null
  private direction: { x: number; y: number } = { x: 1, y: 0 }
  private nextDirection: { x: number; y: number } = { x: 1, y: 0 }
  private score: number = 0
  private gameSpeed: number = 100 // ms
  private lastMoveTime: number = 0
  private paused: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.tileCount = Math.floor(canvas.width / this.gridSize)
    this.initGame()
  }

  private initGame(): void {
    // Initialize snake in the middle
    const startX = Math.floor(this.tileCount / 2)
    const startY = Math.floor(this.tileCount / 2)
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ]
    this.spawnFood()
    this.score = 0
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
  }

  private spawnFood(): void {
    let newFood: { x: number; y: number } = { x: 0, y: 0 }
    let isOnSnake = true

    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount),
      }
      isOnSnake = this.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    }

    this.food = newFood
  }

  public handleKeyPress(key: string): void {
    const keyMap: { [key: string]: { x: number; y: number } } = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      W: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      S: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      A: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      D: { x: 1, y: 0 },
      ' ': { x: 0, y: 0 }, // Space for pause
    }

    if (key === ' ') {
      this.togglePause()
      return
    }

    const newDirection = keyMap[key]
    if (newDirection) {
      // Prevent reversing into itself
      if (newDirection.x !== -this.direction.x || newDirection.y !== -this.direction.y) {
        this.nextDirection = newDirection
      }
    }
  }

  public update(): void {
    if (this.paused) return

    const now = Date.now()
    if (now - this.lastMoveTime < this.gameSpeed) return

    this.lastMoveTime = now
    this.direction = this.nextDirection

    const head = this.snake[0]
    const newHead = {
      x: (head.x + this.direction.x + this.tileCount) % this.tileCount,
      y: (head.y + this.direction.y + this.tileCount) % this.tileCount,
    }

    // Check collision with self
    if (this.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.initGame()
      return
    }

    this.snake.unshift(newHead)

    // Check if food is eaten
    if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 10
      this.spawnFood()
      // Increase speed slightly
      this.gameSpeed = Math.max(50, this.gameSpeed - 1)
    } else {
      this.snake.pop()
    }
  }

  public render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw grid (optional, for better visibility)
    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth = 0.5
    for (let i = 0; i <= this.tileCount; i++) {
      const pos = i * this.gridSize
      this.ctx.beginPath()
      this.ctx.moveTo(pos, 0)
      this.ctx.lineTo(pos, this.canvas.height)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(0, pos)
      this.ctx.lineTo(this.canvas.width, pos)
      this.ctx.stroke()
    }

    // Draw snake
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        this.ctx.fillStyle = '#00ff00'
      } else {
        // Body - gradient effect
        const opacity = 1 - index / this.snake.length * 0.5
        this.ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`
      }
      this.ctx.fillRect(segment.x * this.gridSize + 1, segment.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2)
    })

    // Draw food
    if (this.food) {
      this.ctx.fillStyle = '#ff4444'
      this.ctx.beginPath()
      this.ctx.arc(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 2 - 2,
        0,
        Math.PI * 2
      )
      this.ctx.fill()
    }

    // Draw pause overlay
    if (this.paused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.ctx.fillStyle = 'white'
      this.ctx.font = '30px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2)
    }
  }

  public togglePause(): void {
    this.paused = !this.paused
  }

  public isPaused(): boolean {
    return this.paused
  }

  public reset(): void {
    this.gameSpeed = 100
    this.initGame()
  }

  public getScore(): number {
    return this.score
  }
}
