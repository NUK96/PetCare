<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <u-search 
        v-model="keyword" 
        placeholder="搜索宠物" 
        @search="onSearch"
        shape="round"
        bgColor="#FFF"
      ></u-search>
    </view>

    <!-- 我的宠物列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的宠物</text>
        <text class="add-btn" @click="goToAddPet">+ 添加</text>
      </view>
      
      <view class="pet-list">
        <view 
          v-for="pet in pets" 
          :key="pet.id" 
          class="pet-card"
          @click="goToPetDetail(pet.id)"
        >
          <image :src="pet.avatar || '/static/default-pet.png'" class="pet-avatar"></image>
          <view class="pet-info">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-breed">{{ pet.breed || '未知品种' }}</text>
            <text class="pet-gender">{{ pet.gender === 'male' ? '♂️' : '♀️' }}</text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="pets.length === 0" class="empty-state">
          <text class="empty-text">还没有宠物，快去添加吧~</text>
        </view>
      </view>
    </view>

    <!-- 待办提醒 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">待办提醒</text>
      </view>
      
      <view class="reminder-list">
        <!-- 疫苗提醒 -->
        <view class="reminder-card vaccine">
          <view class="reminder-icon">💉</view>
          <view class="reminder-content">
            <text class="reminder-title">疫苗提醒</text>
            <text class="reminder-desc">咪咪 - 猫三联</text>
            <text class="reminder-time">剩余 3 天</text>
          </view>
        </view>
        
        <!-- 驱虫提醒 -->
        <view class="reminder-card deworming">
          <view class="reminder-icon">💊</view>
          <view class="reminder-content">
            <text class="reminder-title">驱虫提醒</text>
            <text class="reminder-desc">汪汪 - 体内驱虫</text>
            <text class="reminder-time">剩余 7 天</text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="reminders.length === 0" class="empty-state">
          <text class="empty-text">暂无待办事项</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      pets: [],
      reminders: []
    }
  },
  
  onLoad() {
    this.loadPets()
    this.loadReminders()
  },
  
  onPullDownRefresh() {
    this.loadPets()
    this.loadReminders()
    uni.stopPullDownRefresh()
  },
  
  methods: {
    // 加载宠物列表
    async loadPets() {
      try {
        // TODO: 调用 API
        // const res = await this.$api.getPets()
        // this.pets = res.data
        
        // 模拟数据
        this.pets = [
          { id: 1, name: '咪咪', breed: '英短', gender: 'female', avatar: '' },
          { id: 2, name: '汪汪', breed: '金毛', gender: 'male', avatar: '' }
        ]
      } catch (error) {
        console.error('Load pets error:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 加载提醒
    async loadReminders() {
      try {
        // TODO: 调用 API
        // const res = await this.$api.getReminders()
        // this.reminders = res.data
        
        // 模拟数据
        this.reminders = [
          { type: 'vaccine', petName: '咪咪', item: '猫三联', days: 3 },
          { type: 'deworming', petName: '汪汪', item: '体内驱虫', days: 7 }
        ]
      } catch (error) {
        console.error('Load reminders error:', error)
      }
    },
    
    // 搜索
    onSearch() {
      console.log('Search:', this.keyword)
    },
    
    // 跳转到添加宠物
    goToAddPet() {
      uni.navigateTo({
        url: '/pages/add-pet/add-pet'
      })
    },
    
    // 跳转到宠物详情
    goToPetDetail(petId) {
      uni.navigateTo({
        url: `/pages/pet-detail/pet-detail?id=${petId}`
      })
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

.search-bar {
  margin-bottom: 20rpx;
}

.section {
  margin-bottom: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .add-btn {
      font-size: 28rpx;
      color: #FF9500;
    }
  }
}

.pet-list {
  .pet-card {
    display: flex;
    align-items: center;
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    
    .pet-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .pet-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .pet-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .pet-breed {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
      
      .pet-gender {
        font-size: 24rpx;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60rpx 0;
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.reminder-list {
  .reminder-card {
    display: flex;
    align-items: center;
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    
    &.vaccine {
      border-left: 8rpx solid #FF9500;
    }
    
    &.deworming {
      border-left: 8rpx solid #34C759;
    }
    
    .reminder-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }
    
    .reminder-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .reminder-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .reminder-desc {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .reminder-time {
        font-size: 24rpx;
        color: #FF3B30;
      }
    }
  }
}
</style>
