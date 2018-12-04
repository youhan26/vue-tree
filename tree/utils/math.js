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
    x: relativePos.x + basePos.x,
    y: relativePos.y + basePos.y,
  }
}

function isInRectangle(point, [start, end]) {
  if (!point || !start || !end) {
    return false
  }
  return (point.x > start.x && point.x < end.x) &&
    (point.y > start.y && point.y < end.y)
}

export {
  getAbsolutePos,
  isInRectangle
}
