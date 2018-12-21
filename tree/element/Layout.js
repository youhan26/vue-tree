import styleConfig from '../utils/style'
import {getValidItem} from '../utils/util'
import {handleLevelPosition} from '../utils/math'

// 拿配置
/**
 * pickValueFromArrs
 * 用于处理 Box 模型的样式
 * @param option
 * @param index
 */
function pickValueFromArrs(option, index) {
  const result = {}
  Object.keys(option).forEach(function (field) {
    const data = option[field]
    result[field] = Array.isArray(data) ? data[index % data.length] : data
  })
  return result
}

// function getLayer(parent) {
//   return parent ? parent.layer + 1 : 0
// }

export function getNodeDirection(node, parent) {
  return styleConfig.options[node.layer].direction || parent.getLayout().direction
}

/**
 * Layout
 */
class Layout {
  // extend parent style and layout
  setStyleAndLayout(parent, index) {
    this.setLineStyle(parent, index)
    this.setBoxStyle(parent, index)
    this.setTextStyle(parent, index)
    this.setLevelStyle(parent, index)
    this.setLayout(parent, index)
  }

  setLineStyle() {
    this.lineStyle = styleConfig.lineStyle
  }

  getLineStyle() {
    return this.lineStyle
  }

  setBoxStyle(parent, index) {
    const nodeStyle = pickValueFromArrs(styleConfig.options[this.layer].box || {}, index)
    const {width, height} = nodeStyle
    if (width) {
      const data = handleLevelPosition(width)
      data && (nodeStyle.width = data)
    }
    if (height) {
      const data = handleLevelPosition(height)
      data && (nodeStyle.height = data)
    }
    this.boxStyle = {
      ...(parent ? parent.getBoxStyle() : {}),
      ...nodeStyle
    }
  }

  getBoxStyle() {
    return this.boxStyle
  }

  setTextStyle(parent) {
    let texts = styleConfig.options[this.layer].texts || [{}]
    if (!Array.isArray(texts)) {
      texts = [texts]
    }
    const pTexts = parent ? parent.getTextStyle() : [{}]
    this.textStyle = []
    for (let i = 0; i < Math.max(texts.length, pTexts.length); i++) {
      this.textStyle.push({
        ...getValidItem(pTexts, i),
        ...getValidItem(texts, i),
        fontFamily: styleConfig.fontFamily
      })
    }
  }

  getTextStyle() {
    return this.textStyle
  }

  setLevelStyle(parent) {
    this.levelStyle = styleConfig.options[this.layer].level || {}
    if (Object.keys(this.levelStyle).length === 0 && parent) {
      this.levelStyle = parent.getLevelStyle()
    }
  }

  getLevelStyle() {
    return this.levelStyle
  }

  setLayout(parent) {
    const layer = this.layer
    const pLayout = parent ? parent.getLayout() : {child: {}}

    const {child, brother, direction, ignoreChild, showIcon} = styleConfig.options[layer]
    this.layout = {
      child: {
        ...pLayout.child,
        ...handleLevelPosition(child),
      },
      brother: {
        ...pLayout.brother,
        ...handleLevelPosition(brother),
      },
      direction: direction || pLayout.direction,
      ignoreChild: ignoreChild !== undefined ? ignoreChild : pLayout.ignoreChild,
      showIcon: showIcon !== undefined ? showIcon : pLayout.showIcon
    }
  }

  getLayout() {
    return this.layout
  }
}

export default Layout
