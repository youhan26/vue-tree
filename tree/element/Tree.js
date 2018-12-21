import {extraData, extraDataWithStatus} from '../utils/util'
import NodeFactory from '../node/NodeFactory'
import canvas from '../dom/canvas'
import event from '../utils/event'
import {setCurrentActiveKey} from '../utils/style'
import Bus from '../utils/Bus'


class Tree extends Bus {
  constructor(data, ctx, el) {
    super()
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
    this.trigger('update')
  }

  repaint(data, startPos, keepStatus, uniqueKey) {
    let newData
    if (keepStatus && data) {
      newData = extraDataWithStatus(data, this.rootNode.getRawData(), uniqueKey)
    } else {
      newData = extraData(this.rootNode.getRawData())
    }
    this.rootNode = NodeFactory(newData)
    this.draw(startPos)
  }

  toggleNode(node, open) {
    if (!node) {
      return
    }
    let currentNode = node
    if (typeof currentNode !== 'object') {
      currentNode = this.rootNode.getNodeByKey(currentNode)
    }
    // if (currentNode.layer <= 1) {
      // this.closeBrother(currentNode)
    // } else {
    //
    // }
    currentNode.open = !currentNode.open
    open !== undefined && (currentNode.open = open)
    this.repaint()
    this.trigger('change')
  }

  closeBrother(node) {
    node.open = !node.open
    if (node.open && node.parent) {
      node.parent.children.forEach((brother) => {
        brother.open = brother.key === node.key
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
