<template>
  <div class="title">
    <div class="tag"></div>
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
}
.tag {
  width: 10px;
  height: 30px;
  display: inline-block;
  margin-right: 5px;
  background: @primary-red;
}
</style>
