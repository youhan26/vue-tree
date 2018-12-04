import {getNodeDirection} from '../element/Layout'
import {DIRECTIONS} from '../utils/constant'
import Node from './Node'
import BVNode from './BVNode'
import RBVNode from './RBVNode'

const NodeFactory = function (node, parent, index) {
  const direction = getNodeDirection(node, parent)
  switch (direction) {
    case DIRECTIONS.bv: {
      return new BVNode(node, parent, index)
    }
    case DIRECTIONS.rbv: {
      return new RBVNode(node, parent, index)
    }
    default: {
      return new Node(node, parent, index)
    }
  }
}

export default NodeFactory
