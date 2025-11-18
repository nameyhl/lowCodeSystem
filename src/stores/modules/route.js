import { defineStore } from 'pinia'
import { ref } from 'vue'

const routeStore = defineStore(
  'route',
  () => {
    let routes = ref([])

    const setRoutes = (data) => {
      routes.value = data
    }

    const getRoutes = () => {
      return routes.value
    }

    return { routes, setRoutes, getRoutes }
  }
)

export default routeStore
