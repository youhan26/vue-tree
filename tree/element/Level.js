import {getAbsolutePos, handleLevelPosition} from '../utils/math'
import canvas from '../dom/canvas'
// import {changeToArray} from '../utils/util'
import config from '../utils/config'

class Level {
  constructor(node, level, boxStyle, textStyle, levelStyle) {
    this.node = node
    this.level = level
    this.boxStyle = boxStyle
    this.textStyle = textStyle
    this.levelStyle = levelStyle
  }
  getPositions() {
    const p = getAbsolutePos(this.node.realBasePosition, this.node.size.boxPosition)
    const {width: x, height: y} = this.getSize()
    return [
      p,
      getAbsolutePos(p, {x, y})
    ]
  }

  getSize() {
    const {width, height} = this.boxStyle
    if (width && height) {
      return {width, height}
    }
    // todo compute auto box size
    return {width: 0, height: 0}
  }

  updateStyle(ctx, index) {
    ctx.restore()
    const ratio = config.get()
    const {color, fontSize, fontFamily} = this.textStyle[index]
    ctx.lineWidth = 2
    ctx.fillStyle = color
    ctx.font = `${fontSize * ratio}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
  }

  draw(ctx) {
    const levelPos = this.locationLevel(this.levelStyle.direction)
    canvas.drawText(ctx, levelPos, this.level)
  }

  locationLevel(direction) {
    const points = this.getPositions()
    const levelPos = {x: 0, y: 0}
    switch (direction) {
      case 'BR':
        levelPos.x = points[1].x - handleLevelPosition(10)
        levelPos.y = points[1].y - handleLevelPosition(20)
        break
      case 'BL':
        levelPos.x = points[0].x + handleLevelPosition(10)
        levelPos.y = points[1].y - handleLevelPosition(16)
        break
      case 'TR':
        levelPos.x = points[1].x - handleLevelPosition(10)
        levelPos.y = points[0].y + handleLevelPosition(16)
        break
      case 'TL':
        levelPos.x = points[0].x + handleLevelPosition(10)
        levelPos.y = points[0].y + handleLevelPosition(16)
        break
      default:
        break
    }
    return levelPos
  }
}

export default Level
