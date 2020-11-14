class Game {
  static Direction = {
    up: Symbol.for('up'),
    down: Symbol.for('down'),
    left: Symbol.for('left'),
    right: Symbol.for('right'),
  }
  constructor() {
    this.batchedFunctionCall = []
    this.initializeBoard()
    this.initializeControl()
    this.render()
  }
  start() {
    this.requestNextTick(this.render)
  }
  reset() {}
  render() {
    let updateQueue = []
    let isOver = false
    if (this.isFirstRender) {
      updateQueue.push({
        type: 'add',
        className: 'food',
        coordinate: this.food,
      })
      this.snakeCoordinates.forEach((coordinate) => {
        updateQueue.push({
          type: 'add',
          className: 'snake',
          coordinate,
        })
      })
    } else {
      updateQueue = this.calculateUpdateQueue()
    }
    for (const update of updateQueue) {
      const { type, coordinate, className } = update
      const index = this.convertCoordinateToIndex(coordinate)
      const pixel = this.boardElm.querySelector(`.pixel:nth-child(${index})`)
      switch (type) {
        case 'add':
          pixel.classList.add(className)
          break
        case 'remove':
          pixel.classList.remove(className)
          break
        default:
          throw new Error(`unknown update type [${type}]`)
      }
    }
    this.isFirstRender = false
    return !isOver
  }
  convertCoordinateToIndex(coordinate) {
    const [x, y] = coordinate
    return y * Math.sqrt(this.pixelNumber) + x + 1
  }
  calculateUpdateQueue() {
    const calculateNextPixels = (current, direction) => {
      const maxIndex = Math.sqrt(this.pixelNumber) - 1
      let nextSnake = []
      let updateQueue = []
      switch (direction) {
        case Game.Direction.up:
          nextSnake = current.map((pixel, index) => {
            if (index === 0) {
              const [x, y] = pixel
              return [x, y - 1 < 0 ? maxIndex : y - 1]
            } else {
              return [...current[index - 1]]
            }
          })
          break
        case Game.Direction.down:
          nextSnake = current.map((pixel, index) => {
            if (index === 0) {
              const [x, y] = pixel
              return [x, y + 1 > maxIndex ? 0 : y + 1]
            } else {
              return [...current[index - 1]]
            }
          })
          break
        case Game.Direction.left:
          nextSnake = current.map((pixel, index) => {
            if (index === 0) {
              const [x, y] = pixel
              return [x - 1 < 0 ? maxIndex : x - 1, y]
            } else {
              return [...current[index - 1]]
            }
          })
          break
        case Game.Direction.right:
          nextSnake = current.map((pixel, index) => {
            if (index === 0) {
              const [x, y] = pixel
              return [x + 1 > maxIndex ? 0 : x + 1, y]
            } else {
              return [...current[index - 1]]
            }
          })
          break
        default:
          throw new Error('unknown direction')
      }
      updateQueue.push({
        type: 'add',
        className: 'snake',
        coordinate: nextSnake[0],
      })
      updateQueue.push({
        type: 'remove',
        className: 'snake',
        coordinate: current[current.length - 1],
      })
      return { nextSnake, updateQueue }
    }
    const { nextSnake, updateQueue } = calculateNextPixels(
      this.snakeCoordinates,
      this.direction
    )
    this.snakeCoordinates = nextSnake
    return updateQueue
  }
  initializeBoard() {
    this.pixelNumber = 400
    this.boardElm = document.querySelector('main')
    this.snakeCoordinates = this.getRandomSnakes()
    this.food = this.getRandomFood()
    this.foodsInBelly = []
    this.direction = this.getRandomDirection()
    this.speed = 500
    for (let i = 0; i < this.pixelNumber; i++) {
      const pixelElm = document.createElement('div')
      pixelElm.classList.add('pixel')
      this.boardElm.append(pixelElm)
    }
    this.isFirstRender = true
  }
  initializeControl() {
    window.addEventListener('keydown', (event) => {
      if (
        ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.code)
      ) {
        this.batchDirectionChange(() => {
          switch (event.code) {
            case 'ArrowUp':
              this.direction = Game.Direction.up
              break
            case 'ArrowRight':
              this.direction = Game.Direction.right
              break
            case 'ArrowDown':
              this.direction = Game.Direction.down
              break
            case 'ArrowLeft':
              this.direction = Game.Direction.left
              break
          }
        })
      }
    })
  }
  getRandomFood() {
    if ((this.snakeCoordinates?.length ?? 0) === 0) {
      throw new Error('food must be generated after snake generated')
    }
    return [0, 0]
  }
  getRandomSnakes() {
    return [
      [11, 2],
      [11, 3],
      [11, 4],
    ]
  }
  getRandomDirection() {
    return Game.Direction[
      ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]
    ]
  }
  requestNextTick(cb) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        let prevDirection = this.direction
        this.batchedFunctionCall.forEach((fn) => {
          if (typeof fn === 'function') fn()
        })
        this.batchedFunctionCall = []
        const isOppositeOfCurrent = (current, newDirection) => {
          switch (newDirection) {
            case Game.Direction.up:
              return current === Game.Direction.down
            case Game.Direction.right:
              return current === Game.Direction.left
            case Game.Direction.down:
              return current === Game.Direction.up
            case Game.Direction.left:
              return current === Game.Direction.right
          }
        }
        if (isOppositeOfCurrent(prevDirection, this.direction)) {
          this.direction = prevDirection
        }
        const isContinue = cb.call(this)
        if (isContinue === true) {
          this.requestNextTick(cb)
        }
      })
    }, this.speed)
  }
  batchDirectionChange(cb) {
    this.batchedFunctionCall.push(cb.bind(this))
  }
}

export default Game
