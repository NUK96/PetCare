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
import { api, getToken } from '@/utils/api.js';

export default {
  data() {
    return {
      keyword: '',
      pets: [],
      reminders: [],
      loading: false
    }
  },
  
  onLoad() {
    // 检查登录状态
    if (!getToken()) {
      uni.reLaunch({ url: '/pages/login/login' });
      return;
    }
    this.loadPets();
    this.loadReminders();
  },
  
  onPullDownRefresh() {
    this.loadPets();
    this.loadReminders();
    uni.stopPullDownRefresh();
  },
  
  onShow() {
    // 页面显示时刷新数据
    this.loadPets();
    this.loadReminders();
  },
  
  methods: {
    // 加载宠物列表
    async loadPets() {
      if (this.loading) return;
      
      try {
        this.loading = true;
        const res = await api.getPets();
        if (res.code === 200) {
          this.pets = res.data || [];
        }
      } catch (error) {
        console.error('Load pets error:', error);
        uni.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
        // 如果失败，使用空数组
        this.pets = [];
      } finally {
        this.loading = false;
      }
    },
    
    // 加载提醒
    async loadReminders() {
      try {
        // 获取所有宠物的即将到期提醒
        const allReminders = [];
        
        for (const pet of this.pets) {
          try {
            const [vaccines, dewormings] = await Promise.all([
              api.getUpcomingVaccines(pet.id),
              api.getUpcomingDewormings(pet.id)
            ]);
            
            if (vaccines.code === 200 && vaccines.data?.length) {
              vaccines.data.forEach(v => {
                allReminders.push({
                  type: 'vaccine',
                  petId: pet.id,
                  petName: pet.name,
                  item: v.vaccine_name,
                  date: v.next_date,
                  days: this.calculateDays(v.next_date)
                });
              });
            }
            
            if (dewormings.code === 200 && dewormings.data?.length) {
              dewormings.data.forEach(d => {
                allReminders.push({
                  type: 'deworming',
                  petId: pet.id,
                  petName: pet.name,
                  item: d.type === 'internal' ? '体内驱虫' : (d.type === 'external' ? '体外驱虫' : '全面驱虫'),
                  date: d.next_date,
                  days: this.calculateDays(d.next_date)
                });
              });
            }
          } catch (e) {
            console.warn(`Get reminders for pet ${pet.id} failed:`, e);
          }
        }
        
        // 按天数排序
        this.reminders = allReminders.sort((a, b) => a.days - b.days);
      } catch (error) {
        console.error('Load reminders error:', error);
        this.reminders = [];
      }
    },
    
    // 计算剩余天数
    calculateDays(dateStr) {
      if (!dateStr) return 999;
      const targetDate = new Date(dateStr);
      const now = new Date();
      const diffTime = targetDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    
    // 搜索
    onSearch() {
      if (!this.keyword.trim()) {
        this.loadPets();
        return;
      }
      
      this.pets = this.pets.filter(pet => 
        pet.name.includes(this.keyword) || 
        (pet.breed && pet.breed.includes(this.keyword))
      );
    },
    
    // 跳转到添加宠物
    goToAddPet() {
      uni.navigateTo({
        url: '/pages/add-pet/add-pet'
      });
    },
    
    // 跳转到宠物详情
    goToPetDetail(petId) {
      uni.navigateTo({
        url: `/pages/pet-detail/pet-detail?id=${petId}`
      });
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
