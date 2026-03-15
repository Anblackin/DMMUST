<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">must校园</h2>
        </div>
        <!-- 登录表单 -->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="top"
        >
          <!-- 学号/职工号 -->
          <el-form-item prop="account">
            <el-input
              ref="account"
              v-model="loginForm.account"
              placeholder="账户"
              name="account"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <!-- 学号/职工号 -->

          <!-- 密码 -->
          <el-tooltip
            v-model="capsTooltip"
            content="大写锁定键已开启"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                prefix-icon="el-icon-lock"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              >
                <span slot="suffix" class="show-pwd" @click="showPwd">
                  <i
                    :class="
                      passwordType === 'password'
                        ? 'el-icon-view'
                        : 'el-icon-close'
                    "
                  ></i>
                </span>
              </el-input>
            </el-form-item>
          </el-tooltip>
          <!-- 密码 -->

          <!-- 确认密码 -->
          <el-form-item v-if="registerMode" prop="repassword">
            <el-input
              ref="repassword"
              v-model="loginForm.repassword"
              placeholder="确认密码"
              name="repassword"
              type="password"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
          <!-- 确认密码 -->

          <!-- 登录按钮 -->
          <el-button
            v-if="!registerMode"
            :loading="loading"
            type="primary"
            class="login-btn"
            @click.native.prevent="handleLogin"
            >登 录</el-button
          >
          <!-- 登录按钮 -->

          <!-- 注册按钮 -->
          <el-button
            v-if="registerMode"
            :loading="loading"
            type="primary"
            class="login-btn"
            @click.native.prevent="handleRegister"
            >注 册</el-button
          >
          <!-- 注册按钮 -->

          <!-- 切换为注册 -->
          <div class="toggle-wrapper">
            <a class="toggle" @click="registerMode = !registerMode">
              <span v-if="!registerMode">注册</span>
              <span v-else>返回登录</span>
            </a>
          </div>
          <!-- 切换为注册 -->
        </el-form>
        <!-- 登录表单 -->
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码需要6位以上'))
      } else {
        callback()
      }
    }
    const validatorRepassword = (rule, value, callback) => {
      if (value !== this.loginForm.password && this.registerMode) {
        callback(new Error('两次密码不符合'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        repassword: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        repassword: [{ validator: validatorRepassword, trigger: 'blur' }]
      },
      passwordType: 'password',
      registerMode: false,
      capsTooltip: false,
      loading: false,
      redirect: undefined, // redirect 负责获取用户被跳转到登录页面前的页面，可以让用户登录后直接访问到想要访问的页面
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      // 路由重定向
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 表单获取焦点
    if (this.loginForm.account === '') {
      this.$refs.account.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 检查键盘大写锁定键
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          register({
            account: this.loginForm.account,
            password: this.loginForm.password
          }).then(() => {
            this.$message({ message: '注册成功', type: 'success' })
            this.loading = false
            this.registerMode = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../../assets/bg.jpg') no-repeat center center;
    background-size: cover;
  }

  .login-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .login-card {
    width: 420px;
    padding: 50px 40px;
    margin: auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    .login-header {
      text-align: center;
      margin-bottom: 40px;

      .login-title {
        font-size: 24px;
        color: #333;
        font-weight: 600;
      }
    }

    .login-form {
      width: 100%;

      .show-pwd {
        cursor: pointer;
        color: #999;
        font-size: 16px;
        margin-right: 8px;
      }

      .login-btn {
        width: 100%;
        height: 44px;
        font-size: 16px;
        margin-bottom: 20px;
        background: #00a870 !important;
        border-color: #00a870 !important;

        &:hover {
          background: #008f5f !important;
          border-color: #008f5f !important;
        }
      }

      .toggle-wrapper {
        text-align: center;

        .toggle {
          color: #1a73e8;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    .login-wrapper {
      justify-content: center;
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 30px 25px;
    }
  }
}
</style>
