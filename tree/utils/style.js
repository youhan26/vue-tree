import { BOX_TYPES, DIRECTIONS } from './constant'

const lineStyle = {
  color: '#D8D8D8',
  lineWidth: 1
}

const focusStyle = {
  lineWidth: 4
}

const fontFamily = 'Microsoft Yahei, 微软雅黑, Microsoft Sans Serif, sans-serif'

// const colorPools = ['#D634B4', '#34A1D5', '#EC8B13', '#D80606', '#25B218']
const colorPools = ['#7352BF']

const options = [
  {
    // layer 1
    box: {
      lineWidth: 2,
      type: BOX_TYPES.fill,
      color: '#7352BF',
      width: 120,
      height: 68,
      radius: 4 // 判断这个来决定是否画圆角矩形, 若为直角，设置为 0
      // shadowBlur: 8,
      // shadowColor: 'rgba(47,14,124,0.20)',
      // shadowOffsetX: 0,
      // shadowOffsetY: 4,
    },
    texts: [
      // item 第一行文字配置
      {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        offset: 16
      },
      // item 第二行文字配置
      {
        color: 'white',
        fontSize: 12,
        fontWeight: 'normal',
        offset: 14
      }
    ],
    level: {
      direction: 'BR'
    },
    child: {
      x: 0,
      y: 46
    },
    brother: {
      x: 0,
      y: 0
    },
    direction: DIRECTIONS.bv,
    ignoreChild: false,
    showIcon: false
  },
  {
    // layer 2
    box: {
      lineWidth: 1,
      type: BOX_TYPES.line,
      color: colorPools,
      shadowColor: [
        'rgba(124,14,120,0.10)',
        'rgba(14,47,124,0.10)',
        'rgba(124,75,14,0.10)',
        'rgba(124,14,14,0.10)',
        'rgba(14,124,28,0.10)'
      ]
    },
    texts: [
      {
        color: colorPools
      },
      {
        color: colorPools,
        offset: 14
      }
    ],
    child: {
      y: 48
    },
    brother: {
      x: 8,
      y: 0
    },
    direction: DIRECTIONS.bv,
    ignoreChild: false,
    showIcon: true
  },
  {
    // layer 3
    box: {
      lineWidth: 1,
      width: 110,
      height: 66
    },
    child: {
      x: 24,
      y: 10
    },
    brother: {
      x: 20,
      y: 0
    },
    texts: [
      {
        fontSize: 14,
        offset: 16
      },
      {
        fontSize: 12,
        offset: 12
      }
    ],
    direction: DIRECTIONS.rbv, // 扩展方向
    ignoreChild: false // 若为 true 点开子节点的时候，兄弟节点之间的距离不会伸缩效果
  },
  {
    // layer 4
    brother: {
      x: 0,
      y: 10
    },
    ignoreChild: false
  },
  {
    // layer 5
  },
  {
    // layer 6
  },
  {
    // layer 7
    child: {
      x: 20,
      y: 15
    }
  },
  {
    // layer 8
    box: {
      width: 100,
      height: 46
    },
    texts: [
      {
        fontSize: 12,
        offset: 16
      }
    ],
    child: {
      x: 24,
      y: 15
    }
  },
  {
    // layer 9
    box: {
      width: 90,
      height: 40
    },
    texts: [
      {
        offset: 14
      }
    ],
    brother: {
      x: 0,
      y: 6
    },
    child: {
      x: 12,
      y: 10
    }
  }
]

let currentActiveKey = '111'

export const getCurrentActiveKey = function() {
  return currentActiveKey
}

export const setCurrentActiveKey = function(node) {
  currentActiveKey = node && node.key
}

export default {
  lineStyle,
  options,
  fontFamily,
  focusStyle
}
