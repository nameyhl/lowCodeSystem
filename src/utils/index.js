class utils {
  // 防抖
  debounce(func, wait = 300, immediate = false) {
    let timeout
    return function executedFunction(...args) {
      const context = this
      const later = () => {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }
  // 节流
  throttle(func, limit = 300) {
    let inThrottle
    return function (...args) {
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // 格式化时间
  formatTime(time) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

export default new utils()
