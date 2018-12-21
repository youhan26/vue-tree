import {getIconBox, hasChildren, isBVNode, isLeaf, isRBVNode} from '../utils/util'
import {BoxFactory} from '../element/Box'
import Line from '../element/Line'
import Text from '../element/Text'
import Level from '../element/Level'
import Layout from '../element/Layout'
import NodeFactory from './NodeFactory'
import {getAbsolutePos} from '../utils/math'
import canvas from '../dom/canvas'
import event from '../utils/event'


class Node extends Layout {
  constructor(node, parent, index) {
    super()
    const {titles, level, key, layer, open, children, index: indexx, ...others} = node // indexx 防止 ...others 加入
    this.titles = titles
    this.level = level
    this.layer = layer
    this.key = key
    this.parent = parent
    this.open = open !== undefined ? open : false
    this.rawData = {...others, level}

    this.setStyleAndLayout(parent, index)
    this.box = BoxFactory(this, this.getBoxStyle())
    this.text = new Text(this, this.titles, this.getTextStyle())
    this.level = new Level(this, this.level, this.getBoxStyle(), this.getTextStyle(), this.getLevelStyle())
    if (parent) {
      this.line = new Line(this, parent, parent.getLineStyle())
    }
    if (hasChildren(node)) {
      this.children = node.children.map((childNode, index) => {
        return new NodeFactory(childNode, this, index)
      })
    }
    // todo refactor
    this.initNodePosition()
    if (isLeaf(node)) {
      this.initLeafNode()
    } else {
      this.initPosition()
    }
    this.size.iconPosition = this.size.outputPosition
  }

  initNodePosition() {
    this.size = {}
    if (!this.parent) {
      return
    }
    // todo need refactor
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
  }

  initLeafNode() {
    const {width, height} = this.getBoxStyle()
    const {brother} = this.getLayout()
    this.size = {
      ...this.size,
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
    this.level.draw(ctx)
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
      this.drawLinePosition(ctx)
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

  drawLinePosition(ctx) {
    const {width: x, height: y} = this.size.realContainer || {}
    canvas.drawLineBox(ctx, this.realBasePosition, getAbsolutePos(this.realBasePosition, {x, y}))
  }

  drawChildren(ctx) {
    this.children.forEach((child, index) => {
      child.draw(ctx, getAbsolutePos(this.realBasePosition, this.getChildPosition(index)))
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





