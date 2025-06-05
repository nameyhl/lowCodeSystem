import request from "@/utils/requset";

export function addUser(data){
  return request({
    url: '/user/addUser',
    method: 'post',
    data: data,
  })
}
