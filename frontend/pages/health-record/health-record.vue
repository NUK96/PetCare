<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="title">健康记录</text>
      <view class="add-btn" @click="goToAddRecord">
        <text class="icon">+</text>
        <text class="text">添加</text>
      </view>
    </view>

    <!-- 宠物选择 -->
    <view class="pet-selector">
      <picker :value="petIndex" :range="pets" range-key="name" @change="onPetChange">
        <view class="picker">
          <text>{{ selectedPet ? selectedPet.name : '选择宠物' }}</text>
        </view>
      </picker>
    </view>

    <!-- 记录类型筛选 -->
    <view class="filter-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab', currentType === tab.value ? 'active' : '']"
        @click="onTypeChange(tab.value)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 记录列表 -->
    <scroll-view scroll-y class="record-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="records.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无健康记录</text>
      </view>

      <view v-else class="record-card" v-for="record in records" :key="record.id" @click="viewDetail(record)">
        <view class="record-header">
          <text class="record-type">{{ getTypeLabel(record.record_type) }}</text>
          <text class="record-date">{{ record.record_date }}</text>
        </view>
        
        <view class="record-body">
          <view v-if="record.record_type === 'weight'" class="weight-info">
            <text class="weight-value">{{ record.weight }} kg</text>
            <text v-if="record.temperature" class="temperature">体温：{{ record.temperature }}℃</text>
          </view>
          
          <view v-else class="detail-info">
            <text v-if="record.diagnosis" class="diagnosis">诊断：{{ record.diagnosis }}</text>
            <text v-if="record.symptoms" class="symptoms">症状：{{ record.symptoms }}</text>
            <text v-if="record.prescription" class="prescription">处方：{{ record.prescription }}</text>
          </view>
        </view>
        
        <view v-if="record.hospital_name" class="record-footer">
          <text class="hospital">🏥 {{ record.hospital_name }}</text>
          <text v-if="record.doctor_name" class="doctor">👨‍⚕️ {{ record.doctor_name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js';

export default {
  data() {
    return {
      loading: false,
      petIndex: 0,
      pets: [],
      selectedPet: null,
      currentType: 'all',
      records: [],
      tabs: [
        { value: 'all', label: '全部', icon: '📋' },
        { value: 'weight', label: '体重', icon: '⚖️' },
        { value: 'illness', label: '病历', icon: '🏥' },
        { value: 'checkup', label: '体检', icon: '📊' },
        { value: 'symptom', label: '症状', icon: '🤒' }
      ]
    };
  },
  
  onLoad() {
    this.loadPets();
  },
  
  onShow() {
    if (this.selectedPet) {
      this.loadRecords();
    }
  },
  
  methods: {
    // 加载宠物列表
    async loadPets() {
      try {
        const res = await api.getPets();
        if (res.code === 200 && res.data?.length) {
          this.pets = res.data;
          this.selectedPet = res.data[0];
          this.loadRecords();
        } else {
          uni.showToast({ title: '请先添加宠物', icon: 'none' });
          setTimeout(() => uni.navigateBack(), 1500);
        }
      } catch (error) {
        console.error('Load pets error:', error);
      }
    },
    
    // 切换宠物
    onPetChange(e) {
      this.petIndex = e.detail.value;
      this.selectedPet = this.pets[this.petIndex];
      this.loadRecords();
    },
    
    // 切换类型
    onTypeChange(type) {
      this.currentType = type;
      this.loadRecords();
    },
    
    // 加载记录
    async loadRecords() {
      if (!this.selectedPet) return;
      
      this.loading = true;
      try {
        const params = { pet_id: this.selectedPet.id };
        if (this.currentType !== 'all') {
          params.type = this.currentType;
        }
        
        const res = await api.getHealthRecords(params);
        if (res.code === 200) {
          this.records = res.data || [];
        }
      } catch (error) {
        console.error('Load records error:', error);
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    
    // 获取类型标签
    getTypeLabel(type) {
      const tab = this.tabs.find(t => t.value === type);
      return tab ? tab.label : type;
    },
    
    // 添加记录
    goToAddRecord() {
      uni.navigateTo({
        url: `/pages/add-health-record/add-health-record?petId=${this.selectedPet.id}`
      });
    },
    
    // 查看详情
    viewDetail(record) {
      uni.navigateTo({
        url: `/pages/health-record-detail/health-record-detail?id=${record.id}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #F8F8F8;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .add-btn {
    display: flex;
    align-items: center;
    background-color: #FF9500;
    border-radius: 20rpx;
    padding: 10rpx 25rpx;
    
    .icon {
      font-size: 32rpx;
      color: #FFF;
      margin-right: 5rpx;
    }
    
    .text {
      font-size: 26rpx;
      color: #FFF;
    }
  }
}

.pet-selector {
  margin-bottom: 20rpx;
  
  .picker {
    padding: 25rpx;
    background-color: #FFF;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.filter-tabs {
  display: flex;
  gap: 15rpx;
  margin-bottom: 20rpx;
  overflow-x: auto;
  
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #FFF;
    border-radius: 12rpx;
    white-space: nowrap;
    
    &.active {
      background-color: #FFF5E6;
      border: 2rpx solid #FF9500;
    }
    
    .tab-icon {
      font-size: 36rpx;
      margin-bottom: 8rpx;
    }
    
    .tab-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.record-list {
  height: calc(100vh - 350rpx);
  
  .loading, .empty {
    text-align: center;
    padding: 100rpx 0;
    
    .empty-icon {
      font-size: 100rpx;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .record-card {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .record-type {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        background-color: #FFF5E6;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
      }
      
      .record-date {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .record-body {
      margin-bottom: 20rpx;
      
      .weight-info {
        display: flex;
        align-items: baseline;
        gap: 20rpx;
        
        .weight-value {
          font-size: 40rpx;
          font-weight: bold;
          color: #FF9500;
        }
        
        .temperature {
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .detail-info {
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        
        .diagnosis, .symptoms, .prescription {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
    
    .record-footer {
      display: flex;
      justify-content: space-between;
      padding-top: 20rpx;
      border-top: 1rpx solid #EEE;
      
      .hospital, .doctor {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
