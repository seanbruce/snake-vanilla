class Game {
  static Direction = {
    up: Symbol.for('up'),
    down: Symbol.for('down'),
    left: Symbol.for('left'),
    right: Symbol.for('right'),
  }
  constructor() {
    this.initializeBoard()
    this.initializeControl()
  }
  start() {
    this.requestNextTick(this.render)
  }
  reset() {}
  render() {
    if (this.isFirstRender) {
    } else {
    }
    this.isFirstRender = false
  }
  convertCoordinateToIndex() {}
  calculateNextSnake(currentSnake, direction) {
    const updateQueue = []
    const nextSnake = []
    switch (direction) {
      case Game.Direction.up:
        break
      case Game.Direction.down:
        break
      case Game.Direction.left:
        break
      case Game.Direction.right:
        break
      default:
        throw new Error('unknown direction')
    }
    return { nextSnake, updateQueue }
  }
  initializeBoard() {
    this.maxIndex = 400
    this.boardElm = document.querySelector('main')
    this.snakeCoordinates = this.getRandomSnakes()
    this.direction = this.getRandomDirection()
    this.speed = 1000
    for (let i = 0; i < this.maxIndex; i++) {
      const pixelElm = document.createElement('div')
      pixelElm.classList.add('pixel')
      this.boardElm.append(pixelElm)
    }
  }
  initializeControl() {
    window.addEventListener('keydown', (event) => {
      if (
        ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.code)
      ) {
        this.handleDirectionChange(event.code)
      }
    })
  }
  getRandomSnakes() {
    return [
      [128, 234],
      [128, 235],
      [128, 236],
    ]
  }
  getRandomDirection() {
    return Game.Direction[
      ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]
    ]
  }
  handleDirectionChange(type) {
    console.log(type)
  }
  requestNextTick(cb) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const isContinue = cb.call(this)
        if (isContinue === true) {
          this.requestNextTick(cb)
        }
      })
    }, this.speed)
  }
}

export default Game
