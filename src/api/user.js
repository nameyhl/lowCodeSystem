import request from "@/utils/requset";

export function addUser(data){
  return request({
    url: '/user/addUser',
    method: 'post',
    data: data,
  })
}

export function getUser(){
  return request({
    url: '/user/getUser',
    method: 'get',
  })
}

export function updateUser(data){
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: data,
  })
}

export function deleteUser(id){
  return request({
    url: '/user/deleteUser',
    method: 'delete',
    params: id,
  })
}
