<template>
  <view class="container">
    <view class="form">
      <!-- 记录类型 -->
      <view class="form-item">
        <text class="label">记录类型 <text class="required">*</text></text>
        <view class="radio-group">
          <view 
            v-for="item in recordTypes" 
            :key="item.value"
            :class="['radio-item', form.record_type === item.value ? 'active' : '']"
            @click="form.record_type = item.value"
          >
            <text class="radio-icon">{{ item.icon }}</text>
            <text class="radio-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 记录日期 -->
      <view class="form-item">
        <text class="label">记录日期 <text class="required">*</text></text>
        <picker mode="date" :value="form.record_date" @change="onDateChange">
          <view class="picker">
            <text>{{ form.record_date || '请选择' }}</text>
          </view>
        </picker>
      </view>

      <!-- 体重 (仅体重类型显示) -->
      <view v-if="form.record_type === 'weight'" class="form-item">
        <text class="label">体重 (kg)</text>
        <input 
          v-model="form.weight" 
          class="input" 
          type="digit"
          placeholder="例如：3.5" 
        />
      </view>

      <!-- 体温 (仅体重类型显示) -->
      <view v-if="form.record_type === 'weight'" class="form-item">
        <text class="label">体温 (℃)</text>
        <input 
          v-model="form.temperature" 
          class="input" 
          type="digit"
          placeholder="例如：38.5" 
        />
      </view>

      <!-- 症状 (病历/症状类型显示) -->
      <view v-if="['illness', 'symptom'].includes(form.record_type)" class="form-item">
        <text class="label">症状描述</text>
        <textarea 
          v-model="form.symptoms" 
          class="textarea" 
          placeholder="描述宠物症状"
          maxlength="500"
        />
      </view>

      <!-- 诊断结果 (病历类型显示) -->
      <view v-if="form.record_type === 'illness'" class="form-item">
        <text class="label">诊断结果</text>
        <textarea 
          v-model="form.diagnosis" 
          class="textarea" 
          placeholder="医生诊断结果"
          maxlength="500"
        />
      </view>

      <!-- 处方 (病历类型显示) -->
      <view v-if="form.record_type === 'illness'" class="form-item">
        <text class="label">处方</text>
        <textarea 
          v-model="form.prescription" 
          class="textarea" 
          placeholder="医生处方"
          maxlength="500"
        />
      </view>

      <!-- 医院名称 -->
      <view class="form-item">
        <text class="label">医院名称</text>
        <input 
          v-model="form.hospital_name" 
          class="input" 
          placeholder="就诊医院" 
        />
      </view>

      <!-- 医生姓名 -->
      <view class="form-item">
        <text class="label">医生姓名</text>
        <input 
          v-model="form.doctor_name" 
          class="input" 
          placeholder="主治医生" 
        />
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn" @click="onSubmit">
        <text class="btn-text">保存记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js';

export default {
  data() {
    return {
      petId: '',
      form: {
        record_type: 'weight',
        record_date: new Date().toISOString().split('T')[0],
        weight: '',
        temperature: '',
        symptoms: '',
        diagnosis: '',
        prescription: '',
        hospital_name: '',
        doctor_name: ''
      },
      recordTypes: [
        { value: 'weight', label: '体重', icon: '⚖️' },
        { value: 'illness', label: '病历', icon: '🏥' },
        { value: 'checkup', label: '体检', icon: '📊' },
        { value: 'symptom', label: '症状', icon: '🤒' },
        { value: 'medicine', label: '用药', icon: '💊' }
      ]
    };
  },
  
  onLoad(options) {
    if (options.petId) {
      this.petId = options.petId;
    }
  },
  
  methods: {
    // 日期选择
    onDateChange(e) {
      this.form.record_date = e.detail.value;
    },
    
    // 提交
    async onSubmit() {
      // 验证
      if (!this.petId) {
        uni.showToast({ title: '宠物 ID 缺失', icon: 'none' });
        return;
      }
      
      if (!this.form.record_date) {
        uni.showToast({ title: '请选择日期', icon: 'none' });
        return;
      }
      
      // 体重类型验证
      if (this.form.record_type === 'weight' && !this.form.weight) {
        uni.showToast({ title: '请输入体重', icon: 'none' });
        return;
      }
      
      try {
        uni.showLoading({ title: '保存中...' });
        
        const recordData = {
          pet_id: parseInt(this.petId),
          ...this.form,
          weight: this.form.weight ? parseFloat(this.form.weight) : null,
          temperature: this.form.temperature ? parseFloat(this.form.temperature) : null
        };
        
        const res = await api.createHealthRecord(recordData);
        
        if (res.code === 201 || res.code === 200) {
          uni.hideLoading();
          uni.showToast({ title: '保存成功', icon: 'success' });
          setTimeout(() => uni.navigateBack(), 1500);
        } else {
          throw new Error(res.message || '保存失败');
        }
      } catch (error) {
        console.error('Create health record error:', error);
        uni.hideLoading();
        uni.showToast({ title: error.message || '保存失败', icon: 'none' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #F8F8F8;
  min-height: 100vh;
}

.form {
  .form-item {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      
      .required {
        color: #FF3B30;
      }
    }
    
    .input, .textarea {
      width: 100%;
      font-size: 28rpx;
      padding: 20rpx;
      background-color: #F8F8F8;
      border-radius: 8rpx;
    }
    
    .textarea {
      height: 200rpx;
    }
    
    .radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .radio-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25rpx 35rpx;
        background-color: #F8F8F8;
        border-radius: 8rpx;
        
        &.active {
          background-color: #FFF5E6;
          border: 2rpx solid #FF9500;
        }
        
        .radio-icon {
          font-size: 48rpx;
          margin-bottom: 10rpx;
        }
        
        .radio-text {
          font-size: 26rpx;
          color: #666;
        }
      }
    }
    
    .picker {
      padding: 20rpx;
      background-color: #F8F8F8;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .submit-btn {
    background-color: #FF9500;
    border-radius: 12rpx;
    padding: 30rpx;
    text-align: center;
    margin-top: 40rpx;
    
    .btn-text {
      color: #FFF;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}
</style>
