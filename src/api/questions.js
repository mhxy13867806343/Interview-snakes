import request from '../utils/request'

export function getFrontendQuestions(page = 1, pageSize = 10) {
  return request({
    url: '/api/questions/frontend',
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function getBackendQuestions(page = 1, pageSize = 10) {
  return request({
    url: '/api/questions/backend',
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function getAlgorithmQuestions(page = 1, pageSize = 10) {
  return request({
    url: '/api/questions/algorithm',
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function searchQuestions(query, type, page = 1, pageSize = 10) {
  return request({
    url: '/api/search',
    method: 'get',
    params: {
      q: query,
      type,
      page,
      pageSize
    }
  })
}
