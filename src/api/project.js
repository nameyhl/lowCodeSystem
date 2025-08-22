import request from '@/utils/requset'

const className = 'business/project'

export function addProject(data) {
  return request({
    url: `${className}/addProject`,
    method: 'post',
    data,
  })
}

export function getProjectListByLeaderId(data) {
  return request({
    url: `${className}/getProjectListByLeaderId`,
    method: 'get',
    params: data,
  })
}
