import axios from 'axios'
const config = {
  baseUrl: 'http://localhost:8888/api/private/v1/users',
  code: {
    success: 200,
    needLgin: 301,
    error: 500,
    notfoud: 404
  }
}
const ajax = (url, type, params) => {
  return new Promise((reslove, reject) => {
    axios({
      method: type,
      url: `${config.baseUrl}/${url}`,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        let { status } = res.data.meta
        console.log(status, 'codess')
        if (status == 200) {
          reslove(res)
        } else {
          reject(res)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
export const setUser = ({ uId, type }) => {
  return ajax(`/${uId}/state/${type}`, 'put')
}
