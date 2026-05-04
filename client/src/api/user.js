import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data = {}) {
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data
  })
}

/**
 * 获取学生用户，传递的 url query 分为以下情况：
  1. 空参数：获取系统内所有的学生用户
  2. ?buildingId=[]: 获取对应宿舍楼的学生用户
  3. ?floorId=[]: 获取对应楼层的学生用户
  4. ?roomId=[]: 获取对应房间的学生用户
 */
export function getStudents(params) {
  return request({
    url: '/user/getStudents',
    method: 'get',
    params
  })
}

export function searchAdmin(keywords) {
  return request({
    url: '/user/searchAdmin',
    method: 'get',
    params: { keywords }
  })
}

export function searchUser(keywords) {
  return request({
    url: '/user/searchUser',
    method: 'get',
    params: { keywords }
  })
}

export function addAdmin({ name, account, phone, password, role }) {
  return request({
    url: '/user/addAdmin',
    method: 'post',
    data: { name, account, phone, password, role }
  })
}

export function getAdminTableData() {
  return request({
    url: '/user/getAdminTableData',
    method: 'get'
  })
}

export function getStudentInfoByIdOrAccount({ type = 'id', value }) {
  return request({
    url: '/user/getStudentInfoByIdOrAccount',
    method: 'get',
    params: { type, value }
  })
}

/** 批量自动分宿（仅超级管理员） */
export function autoAssignRooms(data) {
  return request({
    url: '/user/autoAssignRooms',
    method: 'post',
    data
  })
}

/** 已入住宿舍的舍友匹配合适度（仅超级管理员） */
export function getRoomCompatibilityReport(params) {
  return request({
    url: '/user/roomCompatibilityReport',
    method: 'get',
    params
  })
}
