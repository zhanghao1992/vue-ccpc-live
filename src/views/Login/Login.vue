<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-row :gutter="20">
        <el-col :span="12" :offset="6">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="用户名" prop="name">
              <el-input ref="name" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="captchaBox" label="图形验证码" prop="captcha">
              <el-input v-model="ruleForm.captcha"></el-input>
              <captcha class="captcha" @setPublicKey="setPublicKeyHandler"></captcha>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script type="text/ecmascript-6">
  import MyHeader from '@/components/base/MyHeader/MyHeader'
  //  import vueValidate from './vueValidate'
  import Captcha from '@/components/base/Captcha/Captcha'
  import { mapGetters, mapActions } from 'vuex'
  import jsencrypt from 'jsencrypt'

  export default {
    data () {
      return {
        ruleForm: {
          name: '',
          password: '',
          captcha: '',
          encryptedCaptcha: ''
        },
        rules: {
          name: [
            {required: true, message: '输入登录名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '输入密码', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '输入图形验证码', trigger: 'blur'}
          ]
        },
        publicKey: ''
      }
    },
    mounted () {},
    computed: {
      ...mapGetters(['captcha'])
    },
    methods: {
      setPublicKeyHandler (publicKey) {
        this.publicKey = publicKey
      },
      onSubmit () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const encrypt = new jsencrypt.JSEncrypt()
            // 图形验证码明文
            const captchaValue = this.ruleForm.captcha
            //  密码加密传输
            const publicKey = this.publicKey
            encrypt.setPublicKey(publicKey)
            this.ruleForm.encryptedCaptcha = encrypt.encrypt(captchaValue)
            console.log(encrypt.encrypt(captchaValue))

            this.$http.post('/node/login', {
              ruleForm: this.ruleForm
            }).then(json => {
              const res = json.data
              if (res.code === 0) {
                const WL = window.localStorage
                WL.setItem('userInfo', JSON.stringify(this.ruleForm))
                this.$router.push('/index')
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.msg
                })
              }
            })
          } else {
            return false
          }
        })
      },
      ...mapActions(['setUser', 'exit'])
    },
    components: {
      Captcha,
      MyHeader
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .captcha {
    position: absolute;
    right: 3px;
    top: 1px;
    bottom: 2px;
  }
</style>
