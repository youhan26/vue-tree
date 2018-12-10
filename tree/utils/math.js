import config from './config'

/**
 * getAbsolutePos
 * @param relativePos
 * @param basePos
 * @returns {{x: *, y: *}}
 */
function getAbsolutePos(relativePos, basePos) {
  if (!relativePos || !basePos) {
    return {x: 0, y: 0}
  }
  return {
    x: Number((relativePos.x + basePos.x).toFixed(2)),
    y: Number((relativePos.y + basePos.y).toFixed(2)),
  }
}

function isInRectangle(point, [start, end]) {
  if (!point || !start || !end) {
    return false
  }
  return (point.x > start.x && point.x < end.x) &&
    (point.y > start.y && point.y < end.y)
}

function handleLevelPosition(position) {
  return baseRatioPosition(position, config.get())
}

function handleRadioPosition(position) {
  return baseRatioPosition(position, config.getRatio())
}

function baseRatioPosition(position, ratio) {
  if (!position) {
    return {}
  }
  if (Array.isArray(position)) {
    return position.map(function (pos) {
      return baseRatioPosition(pos, ratio)
    })
  } else if (typeof position === 'object') {
    const result = {}
    position.x !== undefined && (result.x = position.x * ratio)
    position.y !== undefined && (result.y = position.y * ratio)
    return result
  }
  return position * ratio
}

export {
  getAbsolutePos,
  isInRectangle,
  handleLevelPosition,
  handleRadioPosition
}
