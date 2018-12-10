/**
 * gradientCreator
 * @param start
 * @param end
 * @returns {function(*=): Function}
 */
const gradientCreator = function (start, {x, y}) {
  return function (duration = 500) {
    return function (func) {
      const nums = duration / 1000 * 60
      const offset = {
        x: x / nums,
        y: y / nums
      }
      let position = {x: start.x, y: start.y}
      let counter = 0
      // need change to requestAnimationFrame
      const timer = setInterval(() => {
        counter++
        if (counter > nums) {
          clearInterval(timer)
        } else {
          position = {
            x: position.x + offset.x,
            y: position.y + offset.y
          }
          func && func(position)
        }
      }, 16)
    }
  }
}

export default gradientCreator
