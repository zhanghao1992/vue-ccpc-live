const axios = require('axios')
const qs = require('qs')

module.exports = {
  debug: true,
  getUrl (option) {
    console.log(option)
    if (option.url) {
      return option.url
    } else {
      return 'http://172.21.120.207:18161'
    }
  },
  get (req, res, option, callback) {
    let me = this
    axios.get(`${me.getUrl(option)}${option.path}`, {
      params: req.query
    }).then(json => {
      console.log(json)
      callback(json.data)
    }).catch((err) => {
      console.log(err)
      res.json({code: -1})
    })
  },
  post (req, res, option, callback) {
    let me = this
    let dataObject = {}
    if (req.method === 'GET') {
      if (option.data) {
        dataObject = Object.assign({}, req.query, option.data)
      } else {
        dataObject = Object.assign({}, req.query)
      }
    } else {
      if (option.data) {
        dataObject = Object.assign({}, req.body, option.data)
      } else {
        dataObject = Object.assign({}, req.body)
      }
    }
    console.log(req.method)
    console.log(dataObject)
    // console.log(dataObject)
    axios.post(`${me.getUrl(option)}${option.path}`, qs.stringify(dataObject), {
      // headers: option.headers || {'content-type': 'application/json'}
    }).then(json => {
      callback(json.data)
    }).catch((err) => {
      console.log(err)
      res.json({code: -1})
    })
  }
}
