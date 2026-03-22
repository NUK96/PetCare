<template>
  <view class="container">
    <!-- 宠物选择 -->
    <view class="pet-selector">
      <picker :range="pets" range-key="name" @change="onPetChange">
        <view class="picker-row">
          <text class="label">选择宠物</text>
          <text class="value">{{ pets[petIndex]?.name || '请选择' }}</text>
        </view>
      </picker>
    </view>

    <!-- 驱虫记录列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">驱虫记录</text>
        <text class="add-btn" @click="showAddModal = true">+ 添加</text>
      </view>
      
      <view class="record-list">
        <view v-for="record in records" :key="record.id" class="record-item">
          <view class="record-icon">{{ record.type === 'internal' ? '💊' : '🦠' }}</view>
          <view class="record-content">
            <text class="record-title">{{ record.productName }}</text>
            <text class="record-desc">驱虫日期：{{ record.date }}</text>
            <text class="record-desc">下次驱虫：{{ record.nextDate }}</text>
          </view>
          <view class="record-status" :class="record.status">
            {{ record.status === 'upcoming' ? '即将到期' : '已完成' }}
          </view>
        </view>
        
        <view v-if="records.length === 0" class="empty-state">
          <text class="empty-text">暂无驱虫记录</text>
        </view>
      </view>
    </view>

    <!-- 添加驱虫弹窗 -->
    <u-modal 
      v-model="showAddModal"
      title="添加驱虫记录"
      :show-cancel-button="true"
      @confirm="onAddConfirm"
      @cancel="showAddModal = false"
    >
      <view class="modal-content">
        <u-form :model="form" ref="uForm">
          <u-form-item label="驱虫类型" prop="type">
            <u-radio-group v-model="form.type">
              <u-radio name="internal" label="体内驱虫"></u-radio>
              <u-radio name="external" label="体外驱虫"></u-radio>
              <u-radio name="both" label="内外同驱"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="产品名称" prop="productName">
            <u-input v-model="form.productName" placeholder="例如：大宠爱" />
          </u-form-item>
          <u-form-item label="驱虫日期" prop="date">
            <u-datetime-picker v-model="showDate" mode="date" @confirm="onDateConfirm" />
          </u-form-item>
          <u-form-item label="下次驱虫" prop="nextDate">
            <u-datetime-picker v-model="showNextDate" mode="date" @confirm="onNextDateConfirm" />
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pets: [],
      petIndex: 0,
      records: [],
      showAddModal: false,
      showDate: false,
      showNextDate: false,
      form: {
        type: 'both',
        productName: '',
        date: '',
        nextDate: ''
      }
    }
  },
  
  onLoad(options) {
    this.loadPets()
    this.loadRecords()
  },
  
  methods: {
    async loadPets() {
      try {
        this.pets = [
          { id: 1, name: '咪咪' },
          { id: 2, name: '汪汪' }
        ]
      } catch (error) {
        console.error('Load pets error:', error)
      }
    },
    
    async loadRecords() {
      try {
        this.records = [
          { 
            id: 1, 
            type: 'internal',
            productName: '拜宠清', 
            date: '2026-03-01', 
            nextDate: '2026-06-01',
            status: 'completed'
          },
          { 
            id: 2, 
            type: 'external',
            productName: '福来恩', 
            date: '2026-02-01', 
            nextDate: '2026-03-25',
            status: 'upcoming'
          }
        ]
      } catch (error) {
        console.error('Load records error:', error)
      }
    },
    
    onPetChange(e) {
      this.petIndex = e.detail.value
      this.loadRecords()
    },
    
    onDateConfirm(e) {
      this.form.date = this.formatDate(e.detail.value)
      this.showDate = false
    },
    
    onNextDateConfirm(e) {
      this.form.nextDate = this.formatDate(e.detail.value)
      this.showNextDate = false
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    async onAddConfirm() {
      if (!this.form.productName) {
        uni.showToast({
          title: '请输入产品名称',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
        
        this.showAddModal = false
        this.loadRecords()
      } catch (error) {
        console.error('Add deworming error:', error)
        uni.showToast({
          title: '添加失败',
          icon: 'none'
        })
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

.pet-selector {
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .picker-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .label {
      font-size: 28rpx;
      color: #333;
    }
    
    .value {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.section {
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25rpx;
    
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

.record-list {
  .record-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #EEE;
    
    &:last-child {
      border-bottom: none;
    }
    
    .record-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }
    
    .record-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .record-title {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .record-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 4rpx;
      }
    }
    
    .record-status {
      font-size: 24rpx;
      padding: 6rpx 15rpx;
      border-radius: 20rpx;
      
      &.upcoming {
        background-color: #FFF3E0;
        color: #FF9500;
      }
      
      &.completed {
        background-color: #E8F5E9;
        color: #34C759;
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

.modal-content {
  padding: 20rpx;
}
</style>
