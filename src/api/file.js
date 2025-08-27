import request from '@/utils/requset.js'

const classNmae = 'file'

export function uploadFile(data) {
  return request({
    url: `/${classNmae}/upload`,
    method: 'post',
    data,
  })
}

export function getFileStream(fileName) {
  return request({
    url: `/${classNmae}/stream/${fileName}`,
    method: 'get',
    responseType: 'blob',
  })
}
