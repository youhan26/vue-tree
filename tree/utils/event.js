import {isInRectangle} from './math'

class Event {
  constructor() {
    this.clear()
  }

  addPoints(type, points, node) {
    if (!this.points[type]) {
      this.points[type] = new Map()
    }
    this.points[type].set(points, node)
  }

  clear() {
    this.points = {
      click: new Map(),
      icon: new Map()
    }
  }

  getNodeByPoints(type, point) {
    const map = this.points[type]
    let matchNode = null
    map.forEach((node, points) => {
      if (isInRectangle(point, points)) {
        matchNode = node
      }
    })
    return matchNode
  }
}

export default new Event()
