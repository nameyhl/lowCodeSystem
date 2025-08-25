import request from '@/utils/requset.js'

const classNmae = 'file'

export function uploadFile(data) {
  return request({
    url: `/${classNmae}/upload`,
    method: 'post',
    data,
  })
}

export function downloadFile(fileName) {
  return request({
    url: `/${classNmae}/stream/${fileName}`,
    method: 'get',
  })
}
