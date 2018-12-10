let ratio = 1
let zoom = 1
let level = 1


function setRatio(o) {
  ratio = o
  level = Number((zoom * ratio).toFixed(1))
}

function getRatio() {
  return ratio
}

function setZoom(z) {
  zoom = Math.max(Math.min(z, 2), 1)
  level = Number((zoom * ratio).toFixed(1))
}

function getZoom() {
  return zoom
}

function get() {
  return level
}

function getInitZoom(ratio) {
  if (ratio > 0 && ratio <= 1) {
    return 1
  } else if (ratio > 1 && ratio <= 2) {
    return 0.75
  } else if (ratio > 2) {
    return 0.5
  }
}

export default {
  setRatio,
  getRatio,
  setZoom,
  getZoom,
  get,
  getInitZoom
}
