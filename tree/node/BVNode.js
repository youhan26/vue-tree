import Node from './Node'

class BVNode extends Node {
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
      width: this.children.length * childContainer.width + 2 * brother.x,
      height: childContainer.height + child.y + this.size.box.height + 2 * brother.y
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
      x: this.size.container.width / 2,
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
    const {container, realContainer} = this.size
    return {
      x: this.realBasePosition.x - (realContainer.width - container.width) / 2,
      y: this.realBasePosition.y
    }
  }

  getChildPosition(index) {
    const {brother, child} = this.getLayout()
    const {container: childContainer} = this.children[0].size
    return {
      x: brother.x +
        index * childContainer.width,
      y: brother.y + this.size.box.height + child.y
    }
  }
}

export default BVNode
