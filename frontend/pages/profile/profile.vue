<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <image :src="user.avatar || '/static/default-avatar.png'" class="avatar"></image>
      <view class="user-info">
        <text class="nickname">{{ user.nickname || '未登录' }}</text>
        <text class="user-id">ID: {{ user.id || '-' }}</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToPage('/pages/settings/settings')">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToPage('/pages/feedback/feedback')">
        <text class="menu-icon">💬</text>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToPage('/pages/about/about')">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="section-title">数据统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ stats.petCount }}</text>
          <text class="stat-label">宠物数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.vaccineCount }}</text>
          <text class="stat-label">疫苗记录</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.dewormingCount }}</text>
          <text class="stat-label">驱虫记录</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.healthCount }}</text>
          <text class="stat-label">健康记录</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="onLogout">
      <text class="btn-text">退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: '',
        nickname: '',
        avatar: ''
      },
      stats: {
        petCount: 0,
        vaccineCount: 0,
        dewormingCount: 0,
        healthCount: 0
      }
    }
  },
  
  onLoad() {
    this.loadUserInfo()
    this.loadStats()
  },
  
  methods: {
    // 加载用户信息
    async loadUserInfo() {
      try {
        // TODO: 调用 API
        // const res = await this.$api.getUserInfo()
        // this.user = res.data
        
        // 模拟数据
        this.user = {
          id: '123456',
          nickname: '北野武',
          avatar: ''
        }
      } catch (error) {
        console.error('Load user info error:', error)
      }
    },
    
    // 加载统计
    async loadStats() {
      try {
        // TODO: 调用 API
        // const res = await this.$api.getStats()
        // this.stats = res.data
        
        // 模拟数据
        this.stats = {
          petCount: 2,
          vaccineCount: 5,
          dewormingCount: 8,
          healthCount: 3
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },
    
    // 跳转页面
    goToPage(url) {
      uni.navigateTo({
        url
      })
    },
    
    // 退出登录
    async onLogout() {
      try {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          success: async (res) => {
            if (res.confirm) {
              // TODO: 调用退出登录 API
              // await this.$api.logout()
              
              uni.clearStorageSync()
              uni.reLaunch({
                url: '/pages/login/login'
              })
            }
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #F8F8F8;
  min-height: 100vh;
}

.user-card {
  display: flex;
  align-items: center;
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 30rpx;
  }
  
  .user-info {
    flex: 1;
    
    .nickname {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .user-id {
      display: block;
      font-size: 26rpx;
      color: #999;
    }
  }
}

.menu-section {
  background-color: #FFF;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 35rpx 30rpx;
    border-bottom: 1rpx solid #EEE;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }
    
    .menu-text {
      flex: 1;
      font-size: 30rpx;
      color: #333;
    }
    
    .menu-arrow {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.stats-section {
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 25rpx;
    display: block;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #FF9500;
        margin-bottom: 10rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.logout-btn {
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 35rpx;
  text-align: center;
  
  .btn-text {
    color: #FF3B30;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>
