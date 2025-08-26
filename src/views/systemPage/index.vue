<script setup>
import { ref, watch } from 'vue'

import img1 from '@/assets/systemPage/headPage/img1.png'
import img2 from '@/assets/systemPage/headPage/img2.png'
import img3 from '@/assets/systemPage/headPage/img3.png'

const imgList = [img1, img2, img3]

const routeName = '系统页面'

import { getRoutes } from '@/api/routes'

let routes = ref([])

const getRoutesList = async () => {
  let data = {
    name: routeName,
  }
  let res = await getRoutes(data)
  routes.value = res.data[0].children
}

getRoutesList()

import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

let routePath = ref(route.path)
// 监听路由地址
watch(
  () => route.path,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
    routePath.value = newVal
  },
)

const clickChildren = (path) => {
  window.open(path)
}
</script>
<template>
  <div class="pageBody" v-if="routePath == '/systemPage'">
    <div class="carouselBox">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in imgList" :key="item">
          <img :src="item" alt="" style="width: 100%; height: 400px" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="children">
      <div
        class="childrenItem"
        v-for="item in routes"
        :key="item.id"
        @click="clickChildren(item.router)"
      >
        {{ item.name }}
      </div>
      <div class="childrenItem">更多功能开发中...</div>
    </div>
  </div>
  <div class="childBody" v-else>
    <RouterView />
  </div>
</template>
<style lang="less" scoped>
.pageBody {
  width: 50%;
  height: 500px;
  margin: 0 auto;
  background-color: #fff;

  .children {
    margin-top: 50px;
    display: flex;

    .childrenItem {
      width: 20%;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
}

.childBody {
  width: 50%;
  min-height: calc(100% - 20px);
  margin: 0 auto;
  background-color: #fff;
  padding: 10px;
}
</style>
