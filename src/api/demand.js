import request from '@/utils/requset'

const className = 'business/demand'

export function addDemand(data) {
  return request({
    url: `${className}/addDemand`,
    method: 'post',
    data,
  })
}

export function getDemandList(data) {
  return request({
    url: `${className}/getDemandList`,
    method: 'get',
    params: data,
  })
}

export function updateDemand(data) {
  return request({
    url: `${className}/updateDemand`,
    method: 'put',
    data,
  })
}
