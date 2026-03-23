<template>
  <view class="container">
    <view class="form">
      <!-- 上传照片 -->
      <view class="form-item">
        <text class="label">宠物照片</text>
        <view class="uploader" @click="chooseImage">
          <image v-if="avatar" :src="avatar" class="preview"></image>
          <text v-else class="upload-text">📷 点击上传</text>
        </view>
      </view>

      <!-- 名字 -->
      <view class="form-item">
        <text class="label">名字 <text class="required">*</text></text>
        <input 
          v-model="form.name" 
          class="input" 
          placeholder="请输入宠物名字" 
          maxlength="20"
        />
      </view>

      <!-- 物种 -->
      <view class="form-item">
        <text class="label">物种 <text class="required">*</text></text>
        <view class="radio-group">
          <view 
            class="radio-item" 
            :class="{ active: form.species === 'cat' }"
            @click="form.species = 'cat'"
          >
            <text class="radio-icon">🐱</text>
            <text class="radio-text">猫</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: form.species === 'dog' }"
            @click="form.species = 'dog'"
          >
            <text class="radio-icon">🐶</text>
            <text class="radio-text">狗</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: form.species === 'other' }"
            @click="form.species = 'other'"
          >
            <text class="radio-icon">🐰</text>
            <text class="radio-text">其他</text>
          </view>
        </view>
      </view>

      <!-- 品种 -->
      <view class="form-item">
        <text class="label">品种</text>
        <input 
          v-model="form.breed" 
          class="input" 
          placeholder="例如：英短、金毛" 
        />
      </view>

      <!-- 生日 -->
      <view class="form-item">
        <text class="label">生日</text>
        <picker mode="date" :value="form.birthday" @change="onBirthdayChange">
          <view class="picker">
            <text>{{ form.birthday || '请选择' }}</text>
          </view>
        </picker>
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <text class="label">性别</text>
        <view class="radio-group">
          <view 
            class="radio-item" 
            :class="{ active: form.gender === 'male' }"
            @click="form.gender = 'male'"
          >
            <text class="radio-text">♂️ 弟弟</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: form.gender === 'female' }"
            @click="form.gender = 'female'"
          >
            <text class="radio-text">♀️ 妹妹</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: form.gender === 'unknown' }"
            @click="form.gender = 'unknown'"
          >
            <text class="radio-text">未知</text>
          </view>
        </view>
      </view>

      <!-- 体重 -->
      <view class="form-item">
        <text class="label">体重 (kg)</text>
        <input 
          v-model="form.weight" 
          class="input" 
          type="digit"
          placeholder="例如：3.5" 
        />
      </view>

      <!-- 是否绝育 -->
      <view class="form-item">
        <text class="label">是否绝育</text>
        <view class="switch-row">
          <text class="switch-label">{{ form.neutered ? '已绝育' : '未绝育' }}</text>
          <switch 
            :checked="form.neutered" 
            @change="onNeuteredChange"
            color="#FF9500"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn" @click="onSubmit">
        <text class="btn-text">保存</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js';

export default {
  data() {
    return {
      avatar: '',
      avatarTempPath: '',
      form: {
        name: '',
        species: 'cat',
        breed: '',
        birthday: '',
        gender: 'unknown',
        weight: '',
        neutered: false
      }
    }
  },
  
  methods: {
    // 选择照片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.avatarTempPath = res.tempFilePaths[0];
          this.avatar = res.tempFilePaths[0];
        }
      });
    },
    
    // 生日选择
    onBirthdayChange(e) {
      this.form.birthday = e.detail.value;
    },
    
    // 绝育开关
    onNeuteredChange(e) {
      this.form.neutered = e.detail.value;
    },
    
    // 上传照片到服务器
    async uploadAvatar() {
      if (!this.avatarTempPath) return null;
      
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${process.env.VUE_APP_BASE_URL || 'http://localhost:3000/api/v1'}/upload/avatar`,
          filePath: this.avatarTempPath,
          name: 'file',
          success: (res) => {
            const data = JSON.parse(res.data);
            resolve(data.url);
          },
          fail: (err) => {
            console.warn('Upload avatar failed:', err);
            resolve(null);
          }
        });
      });
    },
    
    // 提交
    async onSubmit() {
      // 验证
      if (!this.form.name) {
        uni.showToast({
          title: '请输入宠物名字',
          icon: 'none'
        });
        return;
      }
      
      try {
        uni.showLoading({ title: '保存中...' });
        
        // 上传头像
        const avatarUrl = await this.uploadAvatar();
        
        // 创建宠物
        const petData = {
          ...this.form,
          avatar: avatarUrl || '',
          weight: this.form.weight ? parseFloat(this.form.weight) : null
        };
        
        const res = await api.createPet(petData);
        
        if (res.code === 201) {
          uni.hideLoading();
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          throw new Error(res.message || '保存失败');
        }
      } catch (error) {
        console.error('Create pet error:', error);
        uni.hideLoading();
        uni.showToast({
          title: error.message || '保存失败',
          icon: 'none'
        });
      }
    }
  }
}
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
    
    .input {
      width: 100%;
      font-size: 28rpx;
      padding: 20rpx;
      background-color: #F8F8F8;
      border-radius: 8rpx;
    }
    
    .radio-group {
      display: flex;
      gap: 20rpx;
      
      .radio-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25rpx;
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
    
    .switch-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .switch-label {
        font-size: 28rpx;
        color: #666;
      }
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

.uploader {
  width: 200rpx;
  height: 200rpx;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .preview {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }
  
  .upload-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
