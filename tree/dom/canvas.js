import {trimDomStyle} from '../utils/util'
import {CANVAS_SIZE, ICON_OFFSET, ICON_SIZE} from '../utils/constant'
import imageHelper from '../utils/imageLoader'
import {handleLevelPosition} from '../utils/math'

/**
 * auto-compute canvas size by parent element
 * @param rootEl
 * @returns {{width: *, height: *}}
 */

function getElementSize(rootEl) {
  let {
    width, height, boxSizing,
    paddingLeft, paddingRight, paddingTop, paddingBottom,
    marginLeft, marginRight, marginTop, marginBottom,
  } = getComputedStyle(rootEl.parentElement)
  paddingLeft = trimDomStyle(paddingLeft)
  paddingRight = trimDomStyle(paddingRight)
  paddingTop = trimDomStyle(paddingTop)
  paddingBottom = trimDomStyle(paddingBottom)
  width = trimDomStyle(width) - trimDomStyle(marginLeft) - trimDomStyle(marginRight)
  height = trimDomStyle(height) - trimDomStyle(marginTop) - trimDomStyle(marginBottom)
  let needFix = false
  if (boxSizing === 'border-box') {
    needFix = true
  }
  return {
    width: needFix ? width - paddingLeft - paddingRight : width || 100,
    height: needFix ? height - paddingTop - paddingBottom : height || 100,
  }
}

/**
 * clearCanvas
 * @param ctx
 * @param size
 */
function clearCanvas(ctx, size = CANVAS_SIZE) {
  ctx.clearRect(-size, -size, size * 2, size * 2)
}


/**
 * drawLineArea
 * @param ctx
 * @param positions
 */
function drawLineArea(ctx, ...positions) {
  ctx.beginPath()
  positions.forEach(function (position, index) {
    if (index) {
      ctx.lineTo(position.x, position.y)
    } else {
      ctx.moveTo(position.x, position.y)
    }
  })
}

// function rads(x) {
//   return Math.PI * x / 180
// }

function drawRoundLineArea(ctx, radius, ...positions) {
  const r = handleLevelPosition(radius)
  ctx.beginPath()
  ctx.moveTo(positions[0].x + r, positions[0].y)
  ctx.arcTo(positions[3].x, positions[3].y, positions[2].x, positions[2].y, r)
  ctx.arcTo(positions[2].x, positions[2].y, positions[1].x, positions[1].y, r)
  ctx.arcTo(positions[1].x, positions[1].y, positions[0].x, positions[0].y, r)
  ctx.arcTo(positions[0].x, positions[0].y, positions[0].x + radius, positions[0].y, r)
}

/**
 * draw
 * @param ctx
 * @param from
 * @param to
 */
function drawLineBox(ctx, from, to) {
  drawLineArea(ctx, from, {x: from.x, y: to.y}, to, {x: to.x, y: from.y}, from)
  ctx.stroke()
}

function drawRoundLineBox(ctx, radius, from, to) {
  drawRoundLineArea(ctx, radius, from, {x: from.x, y: to.y}, to, {x: to.x, y: from.y}, from)
  ctx.stroke()
}

function drawFillBox(ctx, from, to) {
  // console.log('from: ', from, 'to: ', to)
  // console.log('from.x: ', from.x, 'to.y: ', to.y)
  // console.log('to.x: ', to.x, 'from.y: ', from.y)
  drawLineArea(ctx, from, {x: from.x, y: to.y}, to, {x: to.x, y: from.y})
  ctx.fill()
}

function drawRoundFillBox(ctx, radius, from, to) {
  drawRoundLineArea(ctx, radius, from, {x: from.x, y: to.y}, to, {x: to.x, y: from.y})
  ctx.fill()
}

/**
 * draw line by position array
 * @param ctx
 * @param positions
 */
function drawLine(ctx, ...positions) {
  drawLineArea(ctx, ...positions)
  ctx.stroke()
}

/**
 * drawText
 * @param ctx
 * @param text
 * @param position
 */
function drawText(ctx, position, text) {
  ctx.fillText(text, position.x, position.y)
}

function drawIcon(ctx, type, {x, y}) {
  imageHelper(type)
    .then((image) => {
      const {width, height} = image
      const iconSize = handleLevelPosition(ICON_SIZE)
      // console.log('ICON_SIZE: ', ICON_SIZE, 'iconSize: ', iconSize)
      ctx.drawImage(image, 0, 0, width, height, x - iconSize / 2, y + handleLevelPosition(ICON_OFFSET), iconSize, iconSize)
    })
}

/**
 * save the ctx init state
 * @param ctx
 */
function initCanvas(ctx) {
  ctx.save()
}


export default {
  getElementSize,
  clearCanvas,
  drawText,
  drawLineBox,
  drawRoundLineBox,
  drawFillBox,
  drawRoundFillBox,
  drawLine,
  initCanvas,
  drawIcon
}
