<template>
  <div ref="root">
    <button @click="refresh">refresh</button>
    <canvas
      :style="{cursor: showPoint ? 'pointer' : 'move'}"
      :width="width"
      :height="height"
      v-show="showCanvas"
      ref="canvasRef"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseleave="mouseUp"
      @click="click"
    >
    </canvas>
  </div>
</template>

<script>
  import Tree from './component/tree/element/Tree'
  import {generTestData} from './component/tree/utils/util'

  export default {
    name: 'canvasTree',
    data() {
      return {
        title: '组织架构',
        showCanvas: false,
        width: 100,
        height: 100,
        enableDebugger: false,
        showPoint: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.init()
      })
    },
    methods: {
      refresh() {
        this.init()
      },
      init() {
        const rootEl = this.$refs.root
        const {width, height} = Tree.getParentSize(rootEl)
        this.width = width
        this.height = height

        this.showCanvas = true
        this.ctx = this.$refs.canvasRef.getContext('2d')
        this.tree = new Tree(this.getTestData(), this.ctx)
        this.startPos = {x: width / 2 - this.tree.rootNode.size.container.width / 2, y: 0}
        this.$nextTick(() => {
          this.tree.draw(this.startPos)
        })
      },
      getTestData() {
        return generTestData()
      },
      mouseDown(e) {
        this.mousedown = true
        const {pageX, pageY} = e
        this.mousePoint = {
          x: pageX,
          y: pageY,
        }
      },
      mouseMove(e) {
        const {pageX, pageY, offsetX, offsetY} = e
        window.requestAnimationFrame(() => {
          if (!this.mousedown) {
            const showPoint = !!this.tree.event.getNodeByPoints('click', {x: offsetX, y: offsetY}) ||
              !!this.tree.event.getNodeByPoints('icon', {x: offsetX, y: offsetY})
            if (showPoint !== this.showPoint) {
              this.showPoint = showPoint
            }
          } else if (!this.showPoint) {
            this.startPos = {
              x: this.startPos.x + pageX - this.mousePoint.x,
              y: this.startPos.y + pageY - this.mousePoint.y,
            }
            this.mousePoint = {x: pageX, y: pageY}
            this.tree.draw(this.startPos)
          }
        })
      },
      mouseUp() {
        this.mousedown = false
      },
      click(e) {
        const {offsetX, offsetY} = e
        const clickNode = this.tree.event.getNodeByPoints('click', {x: offsetX, y: offsetY})
        if (clickNode) {
          this.tree.activeNode(clickNode)
          return
        }
        const iconNode = this.tree.event.getNodeByPoints('icon', {x: offsetX, y: offsetY})
        if (iconNode) {
          console.log(iconNode, 'have icon clicked')
          this.tree.toggleNode(iconNode)
        }
        if (!clickNode && !iconNode) {
          this.tree.blur()
        }
      },
    },
  }
</script>

<style scoped>
  canvas {
    /*cursor: move;*/
  }
</style>
