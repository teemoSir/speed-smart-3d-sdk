import Vue from 'vue'
import axios from 'axios'
// import store from '@/store' // FIXME:

import {BASE_URL} from './config'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'


// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  baseURL: BASE_URL,
  // baseURL: '',
  timeout: 0, // 请求超时时间,
  headers: { 'Content-Type': 'application/json' }
})

const err = (error) => {
  if (error.response) {
    const { data } = error.response
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    } else if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
    } else {
      notification.error({
        message: '系统接口错误',
        description: data.message
      })
    }
  } else {
    notification.error({
      message: '系统接口错误',
      description: '请联系管理员'
    })
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  // updateToken(config)

  // const token = Vue.prototype.$keycloak.token

  // if (token) {
  //   config.headers.Authorization = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  // }

  return config
}, err)

// response interceptor
service.interceptors.response.use(response => response.data, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

function get(url, params) {
  return new Promise((resolve, reject) => {
    service({
      method: 'GET',
      url,
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'POST',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function put(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'PUT',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function del(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'DELETE',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
function downFile(url, parameter) {
  return service({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
function downFileWithPost(url, parameter) {
  return service({
    url: url,
    data: parameter,
    method: 'POST',
    responseType: 'blob'
  })
}

export {
  installer as VueAxios,
  service as axios,
  get,
  post,
  del,
  put,
  downFile,
  downFileWithPost
}
