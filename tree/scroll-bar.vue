<template>
  <div
    class="container"
    ref="rootRef"
  >
    <div
      class="bar"
      ref="barRef"
      :style="barStyle"
      @mousedown="mouseDown"
    >
    </div>
  </div>
</template>

<script>
  import {toFixed} from './utils/math'

  export default {
    name: 'scroll-bar',
    props: ['content'],
    data() {
      return {
        left: 0,
        width: 200
      }
    },
    mounted() {
      const {width} = this.$refs.rootRef.getBoundingClientRect()
      this.pWidth = width
      this.init = false
      this.$parent.$el.addEventListener('mousemove', this.mouseMove)
      this.$parent.$el.addEventListener('mouseup', this.mouseUp)
    },
    beforeDestroy() {
      this.$parent.$el.removeEventListener('mousemove', this.mouseMove)
      this.$parent.$el.removeEventListener('mouseup', this.mouseUp)
    },
    computed: {
      barStyle() {
        return {
          width: this.width + 'px',
          left: this.left + 'px'
        }
      }
    },
    watch: {
      content(value) {
        this.width = toFixed(value * this.pWidth, 2)
        if (!this.init) {
          this.left = toFixed((this.pWidth - this.width) / 2, 2)
          this.init = true
        }
      }
    },
    methods: {
      mouseDown(e) {
        this.mousedown = true
        this.mousePoint = {
          x: e.pageX,
        }
      },
      updateOffset(offset) {
        if (offset === 0) {
          return
        }
        offset = -offset * this.pWidth
        this.left = Math.max(0, Math.min(this.left + offset, this.pWidth - this.width))
      },
      mouseMove(e) {
        if (!this.mousedown) {
          return
        }
        const offset = e.pageX - this.mousePoint.x
        this.mousePoint = {
          x: e.pageX
        }
        this.left = Math.max(0, Math.min(this.left + offset, this.pWidth - this.width))
        this.$emit('update', offset / this.pWidth)
      },
      mouseUp() {
        this.mousedown = false
      },
    }
  }
</script>

<style scoped>
  .container {
    left: 0;
    right: 0;
    bottom: 0;
    height: 12px;
    position: absolute;
    z-index: 10;
    background-color: #ffffff;
  }

  .bar {
    user-select: none;
    height: 12px;
    background-color: #aa90e8;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
