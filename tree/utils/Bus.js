class Bus {
  constructor() {
    this.listeners = {}
  }

  on(type, func) {
    this.listeners[type] || (this.listeners[type] = [])
    const key = new Date().getTime()
    this.listeners[type].push({
      key,
      func
    })
    return key
  }

  trigger(type, ...args) {
    const listeners = this.listeners[type]
    if (listeners && listeners.length > 0) {
      listeners.forEach(function (listener) {
        const {func} = listener
        func && func(...args)
      })
    }
  }
}

export default Bus
