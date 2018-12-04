import {extraData} from '../utils/util'
import NodeFactory from '../node/NodeFactory'
import canvas from '../dom/canvas'
import event from '../utils/event'
import {setCurrentActiveKey} from '../utils/style'


class Tree {
  constructor(data, ctx, el) {
    this.rootNode = NodeFactory(extraData(data))
    this.event = event
    this.ctx = ctx || this.initCanvas(el)
  }

  draw(startPos) {
    if (startPos) {
      this.startPos = startPos
    }
    canvas.clearCanvas(this.ctx)
    this.event.clear()
    this.rootNode.draw(this.ctx, this.startPos)
  }

  repaint() {
    const rawData = this.rootNode.getRawData()
    this.rootNode = NodeFactory(extraData(rawData))
    this.draw()
  }

  toggleNode(node) {
    this.closeBrother(node)
    this.repaint()
  }

  closeBrother(node) {
    node.open = !node.open
    if (node.open && node.parent) {
      node.parent.children.forEach((brother) => {
        brother.open = brother === node
      })
    }
  }

  addChildren(node, children) {
    this.closeBrother(node)
    node.children = children
    this.repaint()
  }

  // structure not change
  activeNode(node) {
    setCurrentActiveKey(node)
    this.repaint()
  }

  blur() {
    setCurrentActiveKey(12313212)
    this.repaint()
  }

  initCanvas(canvasEl) {
    const {width, height} = canvas.getElementSize(canvasEl)
    this.canvasSize = {width, height}
    canvasEl.width = width
    canvasEl.height = height
    canvas.initCanvas()
    return canvasEl.getContext('2d')
  }

  static getParentSize(el) {
    return canvas.getElementSize(el)
  }
}

export default Tree
