<template>
  <view class="container">
    <view class="logo-section">
      <text class="logo">🐾</text>
      <text class="title">PetCare 宠护</text>
      <text class="subtitle">科学养宠，从记录开始</text>
    </view>

    <view class="form-section">
      <!-- 微信登录按钮 -->
      <view class="login-btn" @click="wechatLogin">
        <text class="btn-icon">💚</text>
        <text class="btn-text">微信一键登录</text>
      </view>

      <view class="divider">
        <text class="divider-text">或</text>
      </view>

      <!-- 手机号登录 -->
      <view class="form-item">
        <input 
          v-model="phone" 
          class="input" 
          placeholder="请输入手机号" 
          type="number"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <input 
          v-model="code" 
          class="input" 
          placeholder="请输入验证码" 
          type="number"
          maxlength="6"
        />
        <text class="send-code" @click="sendCode">
          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
        </text>
      </view>

      <view class="login-btn primary" @click="phoneLogin">
        <text class="btn-text">登录</text>
      </view>

      <view class="agreement">
        <text class="agreement-text">
          登录即代表您同意
          <text class="link" @click="openAgreement('user')">《用户协议》</text>
          和
          <text class="link" @click="openAgreement('privacy')">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      code: '',
      countdown: 0,
      timer: null
    }
  },
  
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  
  methods: {
    // 微信登录
    async wechatLogin() {
      try {
        uni.showLoading({
          title: '登录中...'
        })

        // 微信小程序登录
        // #ifdef MP-WEIXIN
        const { code } = await uni.wxLogin({})
        
        // TODO: 调用后端 API
        // const res = await this.$api.login({
        //   type: 'wechat',
        //   code
        // })
        
        // 模拟登录成功
        setTimeout(() => {
          uni.hideLoading()
          uni.setStorageSync('token', 'mock_token_123456')
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
        // #endif
        
        // #ifndef MP-WEIXIN
        uni.hideLoading()
        uni.showToast({
          title: '请在微信小程序中使用',
          icon: 'none'
        })
        // #endif
      } catch (error) {
        console.error('Wechat login error:', error)
        uni.hideLoading()
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    },
    
    // 发送验证码
    async sendCode() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      if (this.countdown > 0) return
      
      try {
        // TODO: 调用发送验证码 API
        // await this.$api.sendCode(this.phone)
        
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
        
        // 开始倒计时
        this.countdown = 60
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(this.timer)
          }
        }, 1000)
      } catch (error) {
        console.error('Send code error:', error)
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    },
    
    // 手机号登录
    async phoneLogin() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      if (!this.code || this.code.length !== 6) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({
          title: '登录中...'
        })
        
        // TODO: 调用后端 API
        // const res = await this.$api.login({
        //   type: 'phone',
        //   phone: this.phone,
        //   code: this.code
        // })
        
        // 模拟登录成功
        setTimeout(() => {
          uni.hideLoading()
          uni.setStorageSync('token', 'mock_token_123456')
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } catch (error) {
        console.error('Phone login error:', error)
        uni.hideLoading()
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    },
    
    // 打开协议
    openAgreement(type) {
      const url = type === 'user' 
        ? '/pages/agreement/user' 
        : '/pages/agreement/privacy'
      
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 60rpx 40rpx;
  background: linear-gradient(180deg, #FF9500 0%, #FFB347 100%);
  min-height: 100vh;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;
  
  .logo {
    font-size: 120rpx;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #FFF;
    display: block;
    margin-bottom: 15rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    display: block;
  }
}

.form-section {
  background-color: #FFF;
  border-radius: 24rpx 24rpx 0 0;
  padding: 50rpx 40rpx;
  min-height: 600rpx;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07C160;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .btn-icon {
    font-size: 40rpx;
    margin-right: 15rpx;
  }
  
  .btn-text {
    color: #FFF;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  &.primary {
    background-color: #FF9500;
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 40rpx 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1rpx;
    background-color: #EEE;
  }
  
  .divider-text {
    padding: 0 30rpx;
    color: #999;
    font-size: 26rpx;
  }
}

.form-item {
  display: flex;
  align-items: center;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  padding: 25rpx 30rpx;
  margin-bottom: 25rpx;
  
  .input {
    flex: 1;
    font-size: 28rpx;
  }
  
  .send-code {
    color: #FF9500;
    font-size: 26rpx;
    font-weight: bold;
  }
}

.agreement {
  margin-top: 40rpx;
  text-align: center;
  
  .agreement-text {
    font-size: 24rpx;
    color: #999;
    
    .link {
      color: #FF9500;
      text-decoration: underline;
    }
  }
}
</style>
