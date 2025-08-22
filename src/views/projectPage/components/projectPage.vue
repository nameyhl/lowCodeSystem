<script setup>
import { ref } from 'vue'

let props = defineProps({
  projectInfo: {
    type: Object,
    default: () => {},
  },
})

console.log(props.projectInfo)

let projectInfo = ref(props.projectInfo)

// 预览markDown文件
import MarkdownIt from 'markdown-it'
import { watch } from 'vue'
import axios from 'axios'

const md = new MarkdownIt()
const markdownContent = ref('')
const isLoading = ref(false)
const error = ref(null)

watch(
  () => props.projectInfo,
  async (newVal) => {
    if (newVal) {
      isLoading.value = true
      try {
        // 通过nginx地址预览文件
        const filePath = newVal.filePath
        const { data } = await axios.get(filePath, {
          responseType: 'blob',
        })
        console.log(data)

        markdownContent.value = data
      } catch (err) {
        error.value = err
      } finally {
        isLoading.value = false
      }
    }
  },
)
</script>
<template>
  <div>{{ markdownContent }}</div>
</template>
<style lang="less" scoped></style>
