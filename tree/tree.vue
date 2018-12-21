<template>
  <div ref="root" style="height: 100%" class="container">
    <canvas
      :style="{cursor: showPoint ? 'pointer' : this.draggable ? 'grabbing' :  'grab', display: 'block'}"
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
    <scroll-bar
      ref="barRef"
      @update="updateBarPosition"
      :content="barContentPercent"
    />
  </div>
</template>

<script>
  import {debounce} from 'lodash'
  import Tree from './element/Tree'
  import {handleRadioPosition} from './utils/math'
  // import gradientCreator from './animation/animation'
  import config from './utils/config'
  import scrollBar from './scroll-bar'
  import {CANVAS_SCROLL_BAR} from './utils/constant'

  export default {
    name: 'canvasTree',
    components: {
      scrollBar
    },
    props: ['initData', 'zoom'],
    data() {
      return {
        title: '组织架构',
        showCanvas: false,
        width: 100,
        height: 100,
        enableDebugger: false,
        showPoint: false,
        barContentPercent: 0.2,
        draggable: false
      }
    },
    watch: {
      initData(value) {
        value && this.draw(value, true)
      }
    },
    mounted() {
      setTimeout(() => {
        const rootEl = this.$refs.root
        const {width, height} = Tree.getParentSize(rootEl)

        this.barContentPercent = width / CANVAS_SCROLL_BAR
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
      draw(data, keepStatus) {
        if (!this.tree || !keepStatus) {
          this.tree = new Tree(data, this.ctx)
          // this.initTreeUpdate()
          const size = this.tree.rootNode.size
          this.startPos = {x: this.width / 2 - (size.container.width - size.inputPosition.x), y: 20}
          this.$nextTick(() => {
            this.tree.draw(this.startPos)
          })
        } else {
          this.tree.repaint(data, null, keepStatus, 'id')
        }
      },
      initTreeUpdate() {
        if (!this.eventListener) {
          this.eventListener = this.tree.on('update', () => {
            // console.log(this.tree.rootNode.size.container, this.tree.startPos, this.width)
          })
          this.eventListener2 = this.tree.on('change', () => {
            // console.log(this.tree.rootNode.size.container, this.tree.startPos, this.width)
          })
        }
      },
      addChildren(node, children) {
        this.tree.addChildren(node, children)
      },
      // todo need remove event handle to component
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
        this.draggable = true
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
            const offset = (pageX - this.mousePoint.x) * ratio
            this.startPos = {
              x: this.startPos.x + offset,
              y: this.startPos.y + (pageY - this.mousePoint.y) * ratio,
            }
            this.mousePoint = {x: pageX, y: pageY}
            this.tree.draw(this.startPos)
            this.$refs.barRef.updateOffset(offset / CANVAS_SCROLL_BAR)
          }
        })
      },
      mouseUp() {
        this.mousedown = false
        this.draggable = false
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
          /**
           * smooth animation
           */
          // const {realBasePosition, size} = iconNode
          // const {iconPosition} = size
          // const iconRealPosition = getAbsolutePos(realBasePosition, iconPosition)
          // const {x, y} = iconRealPosition
          // const {realBasePosition: startPosition} = this.tree.rootNode
          this.tree.toggleNode(iconNode)
          // gradientCreator(startPosition, {
          //   x: this.width / 2 - x,
          //   y: this.height * 0.3 - y
          // })(500)((position) => {
          //   this.startPos = position
          //   this.tree.draw(position)
          // })
        }
        if (!clickNode && !iconNode) {
          this.tree.blur()
          this.$emit('blur')
        }
      },
      toggleNodeByKey(nodeKey, open) {
        this.tree.toggleNode(nodeKey, open)
      },
      updateBarPosition(offset) {
        if (!offset) {
          return
        }
        const {x, y} = this.startPos
        const position = {
          x: x - CANVAS_SCROLL_BAR * offset,
          y
        }
        this.startPos = position
        requestAnimationFrame(debounce(() => {
          this.tree.draw(position)
        }, 10))
      },
      exportImage() {
        let image = this.$refs.canvasRef.toDataURL()
        let el = document.createElement('a')
        el.setAttribute('href', image)
        el.setAttribute('download', '组织架构.png')
        el.style.display = 'none'
        el.click()
        image = null
        el = null
      }
    },
  }
</script>

<style scoped>
  .container {
    position: relative;
  }
</style>
