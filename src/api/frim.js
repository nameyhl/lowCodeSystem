import request from '@/utils/requset'

const className = 'manager/frim'
export const addFrim = (data) => {
  return request({
    url: `${className}/addFrim`,
    method: 'post',
    data: data,
  })
}

export const getFrimList = (params) => {
  return request({
    url: `${className}/getFrims`,
    method: 'get',
    params,
  })
}

export const updateFrim = (data) => {
  return request({
    url: `${className}/updateFrim`,
    method: 'post',
    data: data,
  })
}

export const deleteFrim = (data) => {
  return request({
    url: `${className}/deleteFrim`,
    method: 'post',
    data: data,
  })
}
