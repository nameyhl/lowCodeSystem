import request from "@/utils/requset";

export const getRoutes = () => {
  return request({
    url: '/routes/getRoutes',
    method: 'get'
  })
}

export const addRoutes = (data) => {
  return request({
    url: `/routes/addRoute`,
    method: 'post',
    data
  })
}

export const deleteRoutes = (data) => {
  return request({
    url: `/routes/deleteRoutes`,
    method: 'post',
    data
  })
}
