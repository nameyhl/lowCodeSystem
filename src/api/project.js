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

export function getProjectDetail(data) {
  return request({
    url: `${className}/getProjectDetail`,
    method: 'get',
    params: data,
  })
}

export function getProjectListByLeader(data) {
  return request({
    url: `${className}/getProjectListByLeader`,
    method: 'get',
    params: data,
  })
}

export function updateProject(data) {
  return request({
    url: `${className}/upDateProjectApprovalInfo`,
    method: 'put',
    data,
  })
}

export function getProjectListByLevel(data) {
  return request({
    url: `${className}/getProjectByLevel`,
    method: 'get',
    params: data,
  })
}

export function updateProjectStatus(data) {
  return request({
    url: `${className}/updateProjectStatus`,
    method: 'put',
    data,
  })
}
