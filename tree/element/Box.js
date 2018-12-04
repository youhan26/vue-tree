/**
 * Box
 */
import {BOX_TYPES} from '../utils/constant'
import canvas from '../dom/canvas'
import {getAbsolutePos} from '../utils/math'
import event from '../utils/event'
import styleConfig, {getCurrentActiveKey} from '../utils/style'


/**
 * Box
 * notice: dependency boxPosition
 */
class Box {
  constructor(node, style) {
    this.node = node
    this.style = style
  }

  getPositions() {
    const p = getAbsolutePos(this.node.realBasePosition, this.node.size.boxPosition)
    const {width: x, height: y} = this.getSize()
    const points = [
      p,
      getAbsolutePos(p, {x, y})
    ]
    event.addPoints('click', points, this.node)
    return points
  }

  getSize() {
    const {width, height} = this.style
    if (width && height) {
      return {width, height}
    }
    // todo compute auto box size
    return {width: 0, height: 0}
  }

  updateStyle(ctx) {
    ctx.restore()
    const {lineWidth, color, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY} = this.style
    ctx.lineWidth = lineWidth
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.shadowBlur = shadowBlur
    ctx.shadowColor = shadowColor
    ctx.shadowOffsetX = shadowOffsetX
    ctx.shadowOffsetY = shadowOffsetY
    if (getCurrentActiveKey() === this.node.key) {
      const {lineWidth} = styleConfig.focusStyle
      ctx.lineWidth = lineWidth
    }
  }
}


class LineBox extends Box {
  draw(ctx) {
    this.updateStyle(ctx)
    const positions = this.getPositions()
    canvas.drawLineBox(ctx, positions[0], positions[1])
  }
}


class FillBox extends Box {
  draw(ctx) {
    this.updateStyle(ctx)
    const positions = this.getPositions()
    canvas.drawFillBox(ctx, positions[0], positions[1])
  }
}


const BoxFactory = function (node, style) {
  if (style.type === BOX_TYPES.fill) {
    return new FillBox(node, style)
  } else if (style.type === BOX_TYPES.line) {
    return new LineBox(node, style)
  }
  return Box(node, style)
}

export {
  BoxFactory
}
