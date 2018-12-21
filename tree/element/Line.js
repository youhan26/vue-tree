/**
 * Line
 */
import { getAbsolutePos } from '../utils/math'
import { DIRECTIONS, LINE_OFFSET } from '../utils/constant'
import canvas from '../dom/canvas'

class Line {
  constructor(node, parent, style) {
    this.node = node
    this.parent = parent
    this.style = style
  }

  draw(ctx, basePosition) {
    this.updateStyle(ctx, basePosition)
    this.update(basePosition)
    canvas.drawLine(ctx, ...this.points)
  }

  updateStyle(ctx) {
    ctx.restore()
    const { color, lineWidth } = this.style
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
  }

  update(
    basePosition = this.node.realBasePosition,
    pBasePosition = this.parent.realBasePosition
  ) {
    const start = getAbsolutePos(pBasePosition, this.parent.size.outputPosition)
    const end = getAbsolutePos(basePosition, this.node.size.inputPosition)
    const { direction } = this.parent.getLayout()
    // 画线的方向
    if (direction === DIRECTIONS.bv) {
      this.points = [
        {
          x: start.x,
          y: start.y + LINE_OFFSET
        },
        {
          x: end.x,
          y: end.y - LINE_OFFSET
        }
      ]
      const middle = (start.y + end.y) / 2
      this.points.splice(this.points.length - 1, 0, { x: start.x, y: middle })
      this.points.splice(this.points.length - 1, 0, { x: end.x, y: middle })
    } else if (direction === DIRECTIONS.rbv) {
      this.points = [
        {
          x: start.x,
          y: start.y + LINE_OFFSET
        },
        {
          x: start.x,
          y: end.y
        },
        {
          x: end.x - LINE_OFFSET,
          y: end.y
        }
      ]
    }
  }
}

export default Line
