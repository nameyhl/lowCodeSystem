<script setup>
import { ref, getCurrentInstance } from 'vue'

let { proxy } = getCurrentInstance()

const props = defineProps({
  demandeObj: {
    type: Object,
    default: () => {},
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
})

const demandeObj = ref(props.demandeObj)

let demande = ref({
  ...demandeObj.value,
})

let demandStatus = ref(false)
if (demande.value.status === 0) {
  demandStatus.value = false
} else {
  demandStatus.value = true
}

let isEdit = ref(false)
import { updateDemand } from '@/api/demand'

const editDemand = () => {
  isEdit.value = true
  demande.value = {
    ...demandeObj.value,
  }
}

const cancel = () => {
  isEdit.value = false
}

const submit = async () => {
  if (demandStatus.value) {
    demande.value.status = 1
  } else {
    demande.value.status = 0
  }
  let data = {
    ...demande.value,
  }
  demande.value.updateTime = proxy.$utils.formatTime(new Date().getTime())
  demandeObj.value = {
    ...demande.value,
  }

  console.log(demande.value)

  await updateDemand(data)
  // 刷新列表
  isEdit.value = false
}

const chackBody = ref(null)
// 添加状态管理
const showModal = ref(false)
const originalPosition = ref({})

const clickBox = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  originalPosition.value = {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    top: `${rect.top}px`,
  }
  showModal.value = true
}
const closeDemand = proxy.$utils.throttle(async (status) => {
  status === 1 ? (demandeObj.value.status = 0) : (demandeObj.value.status = 1)
  updateDemand({
    ...demandeObj.value,
  })
  console.log('关闭')
}, 3000)

const closeModel = () => {
  showModal.value = false
  isEdit.value = false
}

const deleteDemand = () => {
  console.log('delete')
}

const getStatus = (status) => {
  switch (status) {
    case 0:
      return '已关闭'
    case 1:
      return '未开发'
    case 2:
      return '开发中'
    case 3:
      return '已驳回'
    case 4:
      return '未测试'
    case 5:
      return '测试中'
    case 6:
      return '测试未通过'
    case 7:
      return '已完成'
    default:
      return '未知状态'
  }
}
</script>
<template>
  <!-- 原位置占位元素 -->
  <div class="chackBody-placeholder" :style="originalPosition" v-if="showModal"></div>

  <!-- 新增模态框结构 -->
  <div class="modal-mask" v-if="showModal" @click.self="showModal = false">
    <div
      class="chackBody-modal"
      :style="{
        transform: 'translate(-50%, -50%)',
        left: '50%',
        top: '50%',
      }"
    >
      <div class="title">
        <span>需求详情</span>
        <el-icon @click="closeModel"><CircleClose /></el-icon>
      </div>

      <div class="detailBody" v-if="!isEdit" ref="chackBody">
        <div class="item_line">
          <div class="label">需求名称：</div>
          <div class="head">
            <span>{{ demandeObj.name }}</span>
          </div>
        </div>
        <div class="item_line">
          <div class="label">结束时间：</div>
          <div class="head">
            <span>{{ demandeObj.endTime }}</span>
          </div>
        </div>
        <div class="item_line">
          <div class="label">项目状态：</div>
          <div class="head">
            <span :class="{ running: demandeObj.status !== 0, close: demandeObj.status === 0 }">{{
              getStatus(demandeObj.status)
            }}</span>
          </div>
        </div>
        <div class="item_line">
          <div class="label">修改时间：</div>
          <div class="head">
            <span>{{ demandeObj.updateTime ? demandeObj.updateTime : '未修改' }}</span>
          </div>
        </div>
        <div class="item_line" v-if="demandeObj.status === 3">
          <div class="label">驳回原因：</div>
          <div class="content">
            <span>{{ demandeObj.devReject }}</span>
          </div>
        </div>
        <div class="item_line">
          <div class="label">需求描述：</div>
          <div class="content">
            <span>{{ demandeObj.design }}</span>
          </div>
        </div>
      </div>
      <div class="detailBody" v-else>
        <div class="item_line">
          <div class="label">需求名称：</div>
          <div class="head">
            <el-input v-model="demande.name" placeholder="请输入需求名称" style="width: 50%" />
          </div>
        </div>
        <div class="item_line">
          <div class="label">结束时间：</div>
          <div class="head">
            <el-date-picker
              v-model="demande.endTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择结束时间"
              style="width: 50%"
            />
          </div>
        </div>
        <div class="item_line">
          <div class="label">项目状态：</div>
          <div class="head">
            <el-switch v-model="demandStatus" inactive-text="关闭" active-text="启动" />
          </div>
        </div>
        <div class="item_line">
          <div class="label">修改时间：</div>
          <div class="head">
            <span>{{ demande.updateTime ? demande.updateTime : '未修改' }}</span>
          </div>
        </div>
        <div class="item_line">
          <div class="label">需求描述：</div>
          <div class="content">
            <el-input
              v-model="demande.design"
              type="textarea"
              placeholder="请输入需求内容"
              style="width: 50%"
            />
          </div>
        </div>
      </div>
      <div class="footer" v-if="!isEdit">
        <div>
          <el-button type="primary" @click="editDemand">修改</el-button>
          <el-button type="danger" @click="closeDemand(demandeObj.status)">{{
            demandeObj.status === 0 ? '启动' : '关闭'
          }}</el-button>
        </div>
      </div>
      <div class="footer" v-if="isEdit">
        <div>
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button type="danger" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="chackBody"
    :class="{ haveFooter: showDelete }"
    v-else
    @click="clickBox"
    ref="chackBody"
  >
    <div class="head">
      <span>{{ demandeObj.name }}</span>
    </div>
    <div class="head">
      <span :class="{ running: demandeObj.status !== 0, close: demandeObj.status === 0 }">{{
        getStatus(demandeObj.status)
      }}</span>
    </div>
    <div class="content">
      <span>{{ demandeObj.design }}</span>
    </div>
    <div class="demandFooter" v-if="showDelete">
      <el-button type="danger" @click.stop="deleteDemand">删除</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.chackBody-placeholder {
  visibility: hidden;
}

.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
}

.chackBody-modal {
  width: 50%;
  padding: 10px;
  z-index: 9999;
  animation: active 0.8s ease-out;
  position: absolute;
  background: white;
  /* 保持原有样式 */
}
.chackBody {
  height: 120px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  .head {
    height: 30px;
    line-height: 30px;
    font-weight: bold;
  }
  .content {
    height: 60px;
    line-height: 30px;
    overflow: hidden; /* 隐藏超出容器的文本 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 设置盒子的垂直布局 */
    -webkit-line-clamp: 2; /* 限制在块元素显示的文本的行数 */
    line-clamp: 2; /* 限制在块元素显示的文本的行数，标准属性，用于兼容性 */
  }
  .demandFooter {
    float: right;
    height: 30px;
  }
}
.haveFooter {
  height: 150px;
}
.active {
  position: fixed;
  animation: active 0.5s ease-in-out;
  top: 50%;
  left: 50%;
  z-index: 9999;
}
.title {
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  margin-bottom: 30px;
  font-size: 20px;

  .el-icon {
    float: right;
    line-height: 50px;
    height: 50px;
    cursor: pointer;
  }
}
.detailBody {
  width: 100%;

  .item_line {
    display: flex;
    margin-bottom: 10px;
    .head {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .content {
      width: 100%;
      height: 60px;
      line-height: 30px;
      overflow: hidden; /* 隐藏超出容器的文本 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
      -webkit-box-orient: vertical; /* 设置盒子的垂直布局 */
      -webkit-line-clamp: 2; /* 限制在块元素显示的文本的行数 */
      line-clamp: 2; /* 限制在块元素显示的文本的行数，标准属性，用于兼容性 */
    }
    .label {
      height: 30px;
      min-width: 5rem;
      line-height: 30px;
    }
  }
}

.running {
  color: #00ff00;
}

.close {
  color: #ff0000;
}

@keyframes active {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
