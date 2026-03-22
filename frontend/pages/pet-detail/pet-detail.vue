<template>
  <view class="container">
    <!-- 宠物信息卡片 -->
    <view class="pet-card">
      <image :src="pet.avatar || '/static/default-pet.png'" class="pet-avatar"></image>
      <view class="pet-info">
        <text class="pet-name">{{ pet.name }}</text>
        <text class="pet-breed">{{ pet.breed || '未知品种' }}</text>
        <view class="pet-tags">
          <text class="tag">{{ pet.gender === 'male' ? '♂️' : '♀️' }}</text>
          <text class="tag">{{ getAge(pet.birthday) }}</text>
          <text class="tag">{{ pet.neutered ? '已绝育' : '未绝育' }}</text>
        </view>
      </view>
    </view>

    <!-- 健康概览 -->
    <view class="section">
      <view class="section-title">健康概览</view>
      
      <view class="health-grid">
        <view class="health-item">
          <text class="health-icon">💉</text>
          <text class="health-label">下次疫苗</text>
          <text class="health-value">{{ nextVaccineDate || '暂无' }}</text>
        </view>
        
        <view class="health-item">
          <text class="health-icon">💊</text>
          <text class="health-label">下次驱虫</text>
          <text class="health-value">{{ nextDewormingDate || '暂无' }}</text>
        </view>
        
        <view class="health-item">
          <text class="health-icon">⚖️</text>
          <text class="health-label">当前体重</text>
          <text class="health-value">{{ pet.weight ? pet.weight + 'kg' : '暂无' }}</text>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="section">
      <view class="section-title">快捷操作</view>
      
      <view class="action-grid">
        <view class="action-item" @click="goToVaccineRecord">
          <text class="action-icon">📝</text>
          <text class="action-text">记录疫苗</text>
        </view>
        
        <view class="action-item" @click="goToDewormingRecord">
          <text class="action-icon">💊</text>
          <text class="action-text">记录驱虫</text>
        </view>
        
        <view class="action-item" @click="goToWeightRecord">
          <text class="action-icon">⚖️</text>
          <text class="action-text">记录体重</text>
        </view>
        
        <view class="action-item" @click="goToHealthRecord">
          <text class="action-icon">📋</text>
          <text class="action-text">病历记录</text>
        </view>
      </view>
    </view>

    <!-- 最近记录 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">最近记录</text>
        <text class="more" @click="goToAllRecords">查看全部 ></text>
      </view>
      
      <view class="record-list">
        <view v-for="record in recentRecords" :key="record.id" class="record-item">
          <view class="record-icon">{{ record.icon }}</view>
          <view class="record-content">
            <text class="record-title">{{ record.title }}</text>
            <text class="record-desc">{{ record.desc }}</text>
          </view>
          <text class="record-date">{{ record.date }}</text>
        </view>
        
        <view v-if="recentRecords.length === 0" class="empty-state">
          <text class="empty-text">暂无记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      petId: null,
      pet: {
        id: 1,
        name: '咪咪',
        breed: '英短',
        gender: 'female',
        birthday: '2023-01-01',
        weight: 3.5,
        neutered: false,
        avatar: ''
      },
      nextVaccineDate: '2026-04-01',
      nextDewormingDate: '2026-06-01',
      recentRecords: [
        { id: 1, icon: '💉', title: '猫三联', desc: '接种成功', date: '03-01' },
        { id: 2, icon: '💊', title: '体内驱虫', desc: '用药正常', date: '02-01' },
        { id: 3, icon: '⚖️', title: '体重记录', desc: '3.4kg', date: '01-01' }
      ]
    }
  },
  
  onLoad(options) {
    this.petId = options.id
    this.loadPetDetail()
  },
  
  methods: {
    // 加载宠物详情
    async loadPetDetail() {
      try {
        // TODO: 调用 API
        // const res = await this.$api.getPet(this.petId)
        // this.pet = res.data
      } catch (error) {
        console.error('Load pet detail error:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 计算年龄
    getAge(birthday) {
      if (!birthday) return '未知'
      const birth = new Date(birthday)
      const now = new Date()
      const months = (now.getFullYear() - birth.getFullYear()) * 12 + 
                    (now.getMonth() - birth.getMonth())
      
      if (months < 12) {
        return `${months}个月`
      } else {
        const years = Math.floor(months / 12)
        return `${years}岁`
      }
    },
    
    // 跳转到疫苗记录
    goToVaccineRecord() {
      uni.navigateTo({
        url: `/pages/vaccine-record/vaccine-record?petId=${this.petId}`
      })
    },
    
    // 跳转到驱虫记录
    goToDewormingRecord() {
      uni.navigateTo({
        url: `/pages/deworming-record/deworming-record?petId=${this.petId}`
      })
    },
    
    // 跳转到体重记录
    goToWeightRecord() {
      uni.navigateTo({
        url: `/pages/weight-record/weight-record?petId=${this.petId}`
      })
    },
    
    // 跳转到病历记录
    goToHealthRecord() {
      uni.navigateTo({
        url: `/pages/health-record/health-record?petId=${this.petId}`
      })
    },
    
    // 查看全部记录
    goToAllRecords() {
      uni.navigateTo({
        url: `/pages/all-records/all-records?petId=${this.petId}`
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

.pet-card {
  display: flex;
  align-items: center;
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .pet-avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    margin-right: 30rpx;
  }
  
  .pet-info {
    flex: 1;
    
    .pet-name {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .pet-breed {
      display: block;
      font-size: 28rpx;
      color: #999;
      margin-bottom: 15rpx;
    }
    
    .pet-tags {
      display: flex;
      gap: 15rpx;
      
      .tag {
        font-size: 24rpx;
        padding: 6rpx 15rpx;
        background-color: #FFF5E6;
        color: #FF9500;
        border-radius: 20rpx;
      }
    }
  }
}

.section {
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
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .more {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  
  .health-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .health-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }
    
    .health-label {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }
    
    .health-value {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
    }
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .action-icon {
      font-size: 48rpx;
      margin-bottom: 10rpx;
    }
    
    .action-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.record-list {
  .record-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #EEE;
    
    &:last-child {
      border-bottom: none;
    }
    
    .record-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }
    
    .record-content {
      flex: 1;
      
      .record-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 6rpx;
      }
      
      .record-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .record-date {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 40rpx 0;
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
