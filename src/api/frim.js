import request from "@/utils/requset";

export const addFrim = (data) => {
  return request({
    url: '/frim/addFrim',
    method: 'post',
    data: data,
  })
}

export const getFrimList = () => {
  return request({
    url: '/frim/getFrims',
    method: 'get',
  })
}

export const updateFrim = (data) => {
  return request({
    url: '/frim/updateFrim',
    method: 'post',
    data: data,
  })
}

export const deleteFrim = (data) => {
  return request({
    url: '/frim/deleteFrim',
    method: 'post',
    data: data,
  })
}
