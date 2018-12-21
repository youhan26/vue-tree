import {getAbsolutePos, handleLevelPosition} from '../utils/math'
import canvas from '../dom/canvas'
import {changeToArray} from '../utils/util'
import config from '../utils/config'

/**
 * Text
 */
class Text {
  constructor(node, titles, style) {
    this.node = node
    this.styles = style
    this.titles = changeToArray(titles)
  }

  update() {
    const p = getAbsolutePos(this.node.realBasePosition, this.node.size.textPosition)
    const points = []
    this.styles.reduce((currentPos, style) => {
      points.push({
        x: currentPos.x,
        y: currentPos.y + handleLevelPosition(style.offset)
      })
      return {
        x: currentPos.x,
        y: currentPos.y + handleLevelPosition(style.offset) + handleLevelPosition(style.fontSize)
      }
    }, p)
    return points
  }

  draw(ctx) {
    const points = this.update()
    this.titles.forEach((text, index) => {
      this.updateStyle(ctx, index)
      canvas.drawText(ctx, points[index], text)
    })
  }

  updateStyle(ctx, index) {
    ctx.restore()
    const ratio = config.get()
    const {color, fontWeight, fontSize, fontFamily} = this.styles[index]
    ctx.lineWidth = 2
    ctx.fillStyle = color
    ctx.font = `${fontWeight} ${fontSize * ratio}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
  }

  getSize() {
    return {width: 0, height: 0}
  }
}


export default Text
