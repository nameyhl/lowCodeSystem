import request from '@/utils/request'

const classNmae = "file"

export function uploadFile(data) {
  return request({
    url: `/${classNmae}/upload`,
    method: 'post',
    data
  })
}
