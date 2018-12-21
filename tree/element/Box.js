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
    // console.log('width:', width, 'height: ', height)
    if (width && height) {
      return {width, height}
    }
    // todo compute auto box size
    return {width: 0, height: 0}
  }

  getRadius() {
    const {radius} = this.style
    return radius
  }

  updateStyle(ctx) {
    ctx.restore()
    const {lineWidth, radius, color, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY} = this.style
    ctx.lineWidth = lineWidth
    ctx.radius = radius
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
class RoundLineBox extends Box {
  draw(ctx) {
    this.updateStyle(ctx)
    const positions = this.getPositions()
    const radius = this.getRadius()
    canvas.drawRoundLineBox(ctx, radius, positions[0], positions[1])
  }
}


class FillBox extends Box {
  draw(ctx) {
    this.updateStyle(ctx)
    const positions = this.getPositions()
    canvas.drawFillBox(ctx, positions[0], positions[1])
  }
}
class RoundFillBox extends Box {
  draw(ctx) {
    this.updateStyle(ctx)
    const positions = this.getPositions()
    const radius = this.getRadius()
    canvas.drawRoundFillBox(ctx, radius, positions[0], positions[1])
  }
}


const BoxFactory = function (node, style) {
  if (style.type === BOX_TYPES.line) {
    if (style.radius) {
      return new RoundLineBox(node, style)
    } else {
      return new LineBox(node, style)
    }
  } else if (style.type === BOX_TYPES.fill) {
    if (style.radius) {
      return new RoundFillBox(node, style)
    } else {
      return new FillBox(node, style)
    }
  }
  return Box(node, style)
}

export {
  BoxFactory
}
