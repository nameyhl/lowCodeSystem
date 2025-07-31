import request from '@/utils/requset'

import { ElMessage } from 'element-plus'

const ClassName = `examine`

export function getExamine(data) {
  /**
   * data = {
   *   name
   *   type: 1、请假申请，2、加班申请，3、调休神奇，4、出差申请，5、报销申请
   *   page
   *   size
   * }
   */
  return request({
    url: `${ClassName}/getExamine`,
    method: 'get',
    params: data
  })
}

export function addExamine(data) {
  let url = ``
  if (type == 1) {
    url = `${ClassName}/addLeaveExamine`
  } else if (type == 2) {
    url = `${ClassName}/addOvertimeExamine`
  } else if (type == 3) {
    url = `${ClassName}/addAdjustExamine`
  } else if (type == 4) {
    url = `${ClassName}/addBusinessExamine`
  } else if (type == 5) {
    url = `${ClassName}/addReimbursementExamine`
  } else {
    ElMessage.error("审核类型错误")
    throw new Error("审核类型错误")
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updateExamine(data) {
  let url = ``
  if (type == 1) {
    url = `${ClassName}/addLeaveExamine`
  } else if (type == 2) {
    url = `${ClassName}/addOvertimeExamine`
  } else if (type == 3) {
    url = `${ClassName}/addAdjustExamine`
  } else if (type == 4) {
    url = `${ClassName}/addBusinessExamine`
  } else if (type == 5) {
    url = `${ClassName}/addReimbursementExamine`
  } else {
    ElMessage.error("审核类型错误")
    throw new Error("审核类型错误")
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function deleteExamine(data) {
  let url = ``
  if (type == 1) {
    url = `${ClassName}/addLeaveExamine`
  } else if (type == 2) {
    url = `${ClassName}/addOvertimeExamine`
  } else if (type == 3) {
    url = `${ClassName}/addAdjustExamine`
  } else if (type == 4) {
    url = `${ClassName}/addBusinessExamine`
  } else if (type == 5) {
    url = `${ClassName}/addReimbursementExamine`
  } else {
    ElMessage.error("审核类型错误")
    throw new Error("审核类型错误")
  }
  return request({
    url: url,
    method: 'delete',
    params: data
  })
}
