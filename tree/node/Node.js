import {getIconBox, hasChildren, isBVNode, isLeaf, isRBVNode} from '../utils/util'
import {BoxFactory} from '../element/Box'
import Line from '../element/Line'
import Text from '../element/Text'
import Layout from '../element/Layout'
import NodeFactory from './NodeFactory'
import {getAbsolutePos} from '../utils/math'
import canvas from '../dom/canvas'
import event from '../utils/event'


class Node extends Layout {
  constructor(node, parent, index) {
    super()
    const {titles, key, layer, open, children, index: indexx, ...others} = node
    this.titles = titles
    this.layer = layer
    this.key = key
    this.parent = parent
    this.open = open !== undefined ? open : false
    this.rawData = others

    this.setStyleAndLayout(parent, index)
    this.box = BoxFactory(this, this.getBoxStyle())
    this.text = new Text(this, this.titles, this.getTextStyle())
    if (parent) {
      this.line = new Line(this, parent, parent.getLineStyle())
    }
    if (hasChildren(node)) {
      this.children = node.children.map((childNode, index) => {
        return new NodeFactory(childNode, this, index)
      })
    }
    if (isLeaf(node)) {
      this.initLeafNode()
    } else {
      this.initPosition()
    }
    this.initNodePosition()
  }

  initNodePosition() {
    if (!this.parent) {
      return
    }
    const {width, height} = this.getBoxStyle()
    const {brother} = this.getLayout()
    if (isBVNode(this.parent)) {
      this.size.inputPosition = {
        x: width / 2 + brother.x,
        y: brother.y
      }
    } else if (isRBVNode(this.parent)) {
      this.size.inputPosition = {
        x: brother.x,
        y: brother.y + height / 2
      }
    }
    this.size.iconPosition = this.size.outputPosition
  }

  initLeafNode() {
    const {width, height} = this.getBoxStyle()
    const {brother} = this.getLayout()
    this.size = {
      box: {width, height},
      container: {
        width: width + 2 * brother.x,
        height: height + 2 * brother.y
      },
      outputPosition: {
        x: width / 2 + brother.x,
        y: height + brother.y
      },
      boxPosition: {
        x: brother.x,
        y: brother.y
      }
    }
    this.size.textPosition = {
      x: width / 2 + brother.x,
      y: brother.y
    }
  }

  getNodeByKey(index = []) {
    let currentNode = this
    let indexArr = []
    if (typeof index === 'string') {
      indexArr = index.split('-')
    }
    do {
      currentNode = currentNode.children[indexArr.pop()]
    } while (indexArr.length > 0 && hasChildren(currentNode))
    return currentNode
  }

  draw(ctx, basePosition) {
    this.realBasePosition = basePosition
    this.box.draw(ctx)
    this.text.draw(ctx)
    this.line && this.line.draw(ctx)
    if (hasChildren(this)) {
      const realIconPosition = getAbsolutePos(this.realBasePosition, this.size.iconPosition)
      if (this.open) {
        this.drawChildren(ctx)
        this.drawIcon(ctx, 'minus', realIconPosition)
      } else {
        this.drawIcon(ctx, 'add', realIconPosition)
      }
      event.addPoints('icon', getIconBox(realIconPosition), this)
    }
    const enableDebugger = false
    if (enableDebugger) {
      this.drawPosition(ctx)
    }
  }

  getRawData() {
    const {titles, open, rawData: data} = this
    const rawData = {
      titles,
      open,
      ...data
    }
    if (hasChildren(this)) {
      rawData.children = this.children.map((child) => {
        return child.getRawData()
      })
    }
    return rawData
  }

  drawIcon(ctx, type, realIconPosition) {
    this.getLayout().showIcon && canvas.drawIcon(ctx, type, realIconPosition)
  }

  drawPosition(ctx) {
    const {inputPosition, outputPosition, boxPosition} = this.size
    fillPosition(ctx, getAbsolutePos(this.realBasePosition, inputPosition))
    fillPosition(ctx, this.realBasePosition)
    fillPosition(ctx, getAbsolutePos(this.realBasePosition, outputPosition))
    fillPosition(ctx, getAbsolutePos(this.realBasePosition, boxPosition))
  }

  drawChildren(ctx) {
    const fixOffset = this.getChildBasePosition()
    this.children.forEach((child, index) => {
      child.draw(ctx, getAbsolutePos(fixOffset, this.getChildPosition(index)))
    })
  }
}

function fillPosition(ctx, position) {
  if (!position) {
    return
  }
  ctx.fillText(`${position.x},${position.y}`, position.x, position.y)
}


export default Node





