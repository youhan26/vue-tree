import {DEFAULT_SHOW_LAYER, DIRECTIONS, ICON_SIZE} from './constant'

function trimDomStyle(str = '0') {
  return Number(str.replace('px', ''))
}


function isFunction(s) {
  return s && typeof s === 'function'
}

/**
 * simple extend
 * @param dest
 * @param origins
 */
function extend(dest, ...origins) {
  origins.forEach(function (origin) {
    const proto = origin.prototype
    Object.keys(proto)
      .forEach(function (methodField) {
        if (!dest[methodField] && isFunction(proto[methodField])) {
          dest.prototype[methodField] = proto[methodField]
        }
      })
  })
}

/**
 * getValidItem
 * @param arr
 * @param index
 * @returns {*}
 */
function getValidItem(arr, index) {
  return arr[index > arr.length - 1 ? arr.length - 1 : index]
}

/**
 * hasChildren
 * @param node
 * @returns {*|boolean}
 */
function hasChildren(node) {
  return node.children && node.children.length > 0
}

/**
 * isLeaf
 * @param node
 * @returns {boolean}
 */
function isLeaf(node) {
  return !hasChildren(node) || !node.open
}


/**
 * change text to array
 * @param text
 * @returns {*[]}
 */
function changeToArray(text) {
  return Array.isArray(text) ? text : [text]
}


/**
 * handleData
 * @param node
 * @param layer
 * @param key
 */
function extraData(node, layer = 0, key = null) {
  const result = {...node}
  const {children} = node
  result.layer = layer
  result.key = key
  result.open = node.open === undefined ? layer <= DEFAULT_SHOW_LAYER : node.open
  if (children && children.length > 0) {
    result.children = node.children.map(function (child, cKey) {
      return extraData(child, layer + 1, key ? `${key}-${cKey}` : `${cKey}`)
    })
  }
  return result
}

/**
 * extraDataWithStatus
 * @param node
 * @param originNode
 * @param uniqueKey
 * @param layer
 * @param key
 * @returns {{}}
 */
function extraDataWithStatus(node, originNode, uniqueKey, layer = 0, key = null) {
  const result = {...node}
  const {children} = node
  result.layer = layer
  result.key = key
  result.open = originNode ? originNode.open : layer <= DEFAULT_SHOW_LAYER
  if (children && children.length > 0) {
    result.children = node.children.map(function (child, cKey) {
      return extraDataWithStatus(
        child,
        originNode.children && originNode.children.find(function (item) {
          return item[uniqueKey] === child[uniqueKey]
        }),
        uniqueKey,
        layer + 1,
        key ? `${key}-${cKey}` : `${cKey}`
      )
    })
  }
  return result
}

function isBVNode(node) {
  return node.getLayout().direction === DIRECTIONS.bv
}

function isRBVNode(node) {
  return node.getLayout().direction === DIRECTIONS.rbv
}

function getIconBox({x, y}) {
  return [
    {x: x - ICON_SIZE / 2, y},
    {x: x + ICON_SIZE / 2, y: y + ICON_SIZE}
  ]
}


function generTestData() {
  function generateChildren({label = ''}) {
    const len = Math.floor(Math.random() * 10 + 1)
    const result = []
    for (let i = 0; i < len; i++) {
      result.push({
        titles: `测试节点${label}-${i}`,
        value: `测试节点${label}-${i}`,
        level: Math.round(Math.random() * 3)
      })
    }
    return result
  }

  function generatorData(maxLayer = 2) {
    let result = []
    let currentPNodes = []
    for (let i = 1; i <= maxLayer; i++) {
      if (currentPNodes.length <= 0) {
        const initArr = generateChildren({})
        result = initArr
        currentPNodes = [].concat(initArr)
      } else {
        let tempArr = []
        currentPNodes.forEach(function (node) {
          node.children = generateChildren(node)
          tempArr = tempArr.concat(node.children)
        })
        currentPNodes = tempArr
      }
    }
    return result
  }

  return {
    titles: '跨越速运',
    value: 'root',
    level: 1,
    children: generatorData(7),
  }
}


export {
  trimDomStyle,
  extend,
  getValidItem,
  hasChildren,
  changeToArray,
  extraData,
  isBVNode,
  isRBVNode,
  getIconBox,
  isLeaf,
  extraDataWithStatus,
  generTestData
}
