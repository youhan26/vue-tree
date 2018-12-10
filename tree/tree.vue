<template>
  <div ref="root" style="height: 100%">
    <canvas
      :style="{cursor: showPoint ? 'pointer' : 'move', display: 'block'}"
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
  import Tree from './element/Tree'
  import {getAbsolutePos, handleRadioPosition} from './utils/math'
  import gradientCreator from './animation/animation'
  import config from './utils/config'

  export default {
    name: 'canvasTree',
    props: ['initData', 'zoom'],
    data() {
      return {
        title: 'Root',
        showCanvas: false,
        width: 100,
        height: 100,
        enableDebugger: false,
        showPoint: false,
      }
    },
    watch: {
      initData(value) {
        value && this.draw(value)
      }
    },
    mounted() {
      setTimeout(() => {
        const rootEl = this.$refs.root
        const {width, height} = Tree.getParentSize(rootEl)
        const canvasEl = this.$refs.canvasRef
        this.ctx = canvasEl.getContext('2d')

        const ratio = window.devicePixelRatio || 1
        config.setRatio(ratio)
        config.setZoom(config.getInitZoom(ratio))

        this.width = width * ratio
        this.height = height * ratio
        this.showCanvas = true
        canvasEl.style.width = width + 'px'
        canvasEl.style.height = height + 'px'
        // this.ctx.scale(ratio, ratio)
        canvasEl.addEventListener('mousewheel', this.mouseWheel)
      })
    },
    beforeDestroy() {
      this.$refs.canvasRef.removeEventListener('mousewheel', this.mouseWheel)
    },
    methods: {
      draw(data) {
        if (!this.tree) {
          this.tree = new Tree(data, this.ctx)
          this.startPos = {x: this.width / 2 - this.tree.rootNode.size.container.width / 2, y: 20}
          this.$nextTick(() => {
            this.tree.draw(this.startPos)
          })
        } else {
          this.tree.repaint(data)
        }
      },
      addChildren(node, children) {
        this.tree.addChildren(node, children)
      },
      mouseWheel(e) {
        if (!this.zoom) {
          return
        }
        window.requestAnimationFrame(() => {
          const zoom = e.wheelDelta / 1200
          config.setZoom(config.getZoom() + zoom)
          this.tree.repaint()
        })
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
        const ratio = config.getRatio()
        window.requestAnimationFrame(() => {
          if (!this.tree) {
            return
          }
          if (!this.mousedown) {
            const showPoint = !!this.tree.event.getNodeByPoints('click', handleRadioPosition({
                x: offsetX,
                y: offsetY
              })) ||
              !!this.tree.event.getNodeByPoints('icon', handleRadioPosition({x: offsetX, y: offsetY}))
            if (showPoint !== this.showPoint) {
              this.showPoint = showPoint
            }
          } else if (!this.showPoint) {
            this.startPos = {
              x: this.startPos.x + (pageX - this.mousePoint.x) * ratio,
              y: this.startPos.y + (pageY - this.mousePoint.y) * ratio,
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
        if (!this.tree) {
          return
        }
        const {offsetX, offsetY} = e
        const clickNode = this.tree.event.getNodeByPoints('click', handleRadioPosition({x: offsetX, y: offsetY}))
        if (clickNode) {
          this.tree.activeNode(clickNode)
          this.$emit('click', clickNode)
          return
        }
        const iconNode = this.tree.event.getNodeByPoints('icon', handleRadioPosition({x: offsetX, y: offsetY}))
        if (iconNode) {
          const {realBasePosition, size} = iconNode
          const {iconPosition} = size
          const iconRealPosition = getAbsolutePos(realBasePosition, iconPosition)
          const {x, y} = iconRealPosition
          const {realBasePosition: startPosition} = this.tree.rootNode
          this.tree.toggleNode(iconNode)
          gradientCreator(startPosition, {
            x: this.width / 2 - x,
            y: this.height * 0.3 - y
          })(500)((position) => {
            this.startPos = position
            this.tree.draw(position)
          })
        }
        if (!clickNode && !iconNode) {
          this.tree.blur()
          this.$emit('blur')
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
