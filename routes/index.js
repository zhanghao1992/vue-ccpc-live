var express = require('express')
var router = express.Router()
var captcha = require('../lib/captcha')
let vService = require('../lib/vService')

router.post('/login', function (req, res) {
  var captchaResult = captcha.check(req, req.body.ruleForm.encryptedCaptcha)
  if (captchaResult.code === 0) {
    res.json({
      code: 0,
      msg: '登陆成功',
      response: {}
    })
  } else {
    res.send(JSON.stringify(captchaResult))
  }
})

// 获取赛事ID列表
router.get('/match/getMatchList', function (req, res) {
  vService.post(req, res, {path: '/match/getMatchList'}, function (json) {
    res.send(json)
  })
})

// 添加赛事ID
router.post('/match/addMatch', function (req, res) {
  vService.post(req, res, {path: '/match/addMatch'}, function (json) {
    res.send(json)
  })
})

// 删除赛事ID
router.post('/match/deleteMatch', function (req, res) {
  vService.post(req, res, {path: '/match/deleteMatch'}, function (json) {
    res.send(json)
  })
})

// 总排名
router.get('/player/getMatchPlayerRank', function (req, res) {
  vService.post(req, res, {path: '/player/getMatchPlayerRank'}, function (json) {
    res.send(json)
  })
})

module.exports = router
