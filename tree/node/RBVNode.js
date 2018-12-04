import Node from './Node'

class RBVNode extends Node {
  initPosition() {
    const {brother, child, ignoreChild} = this.getLayout()
    const {container: childContainer} = this.children[0].size
    const {width, height} = this.getBoxStyle()
    this.size = {
      box: {
        width,
        height
      }
    }
    this.size.realContainer = {
      width: 2 * brother.x + child.x + this.size.box.width / 2 + childContainer.width,
      height: 2 * brother.y + child.y + this.size.box.height +
        this.children.reduce((sum, current) => {
          return sum + current.size.container.height
        }, 0)
    }
    if (ignoreChild) {
      this.size.container = {
        width: width + 2 * brother.x,
        height: height + 2 * brother.y
      }
    } else {
      this.size.container = this.size.realContainer
    }

    this.size.textPosition = {
      x: brother.x + this.size.box.width / 2,
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

  getChildBasePosition() {
    return {
      x: this.realBasePosition.x,
      y: this.realBasePosition.y
    }
  }

  getChildPosition(index) {
    const {brother, child} = this.getLayout()
    return {
      x: brother.x + this.size.box.width / 2 + child.x,
      y: brother.y + this.size.box.height + child.y +
        this.children.slice(0, index).reduce((sum, current) => {
          return sum + current.size.container.height
        }, 0)
    }
  }
}

export default RBVNode
