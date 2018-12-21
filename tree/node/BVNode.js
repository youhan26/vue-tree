import Node from './Node'
import {isBVNode} from '../utils/util'

class BVNode extends Node {
  initPosition() {
    const {brother, child, ignoreChild} = this.getLayout()
    const {width, height} = this.getBoxStyle()
    this.size = {
      ...this.size,
      box: {
        width,
        height
      }
    }
    const childrenWidth = this.children.reduce((sum, current) => {
      return sum + current.size.container.width
    }, 0)
    this.size.realContainer = {
      width: Math.max(
        this.size.box.width,
        childrenWidth
      ) + 2 * brother.x,
      height: this.children.reduce((sum, current) => {
        return Math.max(sum, current.size.container.height)
      }, 0) + child.y + this.size.box.height + 2 * brother.y
    }
    if (ignoreChild) {
      this.size.container = {
        width: width + 2 * brother.x,
        height: height + 2 * brother.y
      }
    } else {
      this.size.container = this.size.realContainer
      // todo need refactor
      if (!this.parent || isBVNode(this.parent)) {
        const childrenLen = this.children.length
        // odd
        if (childrenLen % 2) {
          const middleIndex = Math.floor(childrenLen / 2)
          this.size.inputPosition = {
            x: this.children.slice(0, middleIndex).reduce(function (sum, item) {
              return sum + item.size.container.width
            }, 0) + this.children[middleIndex].size.inputPosition.x + brother.x,
            y: brother.y
          }
        } else {
          // even
          const firstChild = this.children[0]
          const lastChild = this.children[childrenLen - 1]
          const firstChildInput = firstChild.size.inputPosition.x
          this.size.inputPosition = {
            x: firstChildInput + (childrenWidth - firstChildInput - (lastChild.size.container.width - lastChild.size.inputPosition.x)) / 2 + brother.x,
            y: brother.y
          }
        }
      }
    }
    this.size.textPosition = {
      x: this.size.inputPosition.x,
      y: brother.y
    }
    this.size.boxPosition = {
      x: this.size.textPosition.x - this.size.box.width / 2,
      y: this.size.textPosition.y
    }
    this.size.outputPosition = {
      x: this.size.textPosition.x,
      y: this.size.box.height + brother.y
    }
  }

  getChildPosition(index) {
    const {brother, child} = this.getLayout()
    return {
      x: brother.x +
        this.children.slice(0, index).reduce((sum, current) => {
          return sum + current.size.container.width
        }, 0),
      y: brother.y + this.size.box.height + child.y
    }
  }
}

export default BVNode
