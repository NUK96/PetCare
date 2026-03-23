<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search 
        v-model="keyword" 
        placeholder="搜索养宠知识" 
        @search="onSearch"
        shape="round"
        bgColor="#FFF"
      ></u-search>
    </view>

    <!-- 分类筛选 -->
    <scroll-view scroll-x class="category-scroll">
      <view class="category-list">
        <view 
          v-for="cat in categories" 
          :key="cat.value"
          :class="['category-item', currentCategory === cat.value ? 'active' : '']"
          @click="onCategoryChange(cat.value)"
        >
          <text>{{ cat.label }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 知识列表 -->
    <scroll-view scroll-y class="knowledge-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="knowledgeList.length === 0" class="empty">
        <text class="empty-icon">📚</text>
        <text class="empty-text">暂无知识内容</text>
      </view>

      <view v-else class="knowledge-card" v-for="item in knowledgeList" :key="item.id" @click="viewDetail(item.id)">
        <view class="knowledge-header">
          <text class="category-tag">{{ getCategoryLabel(item.category) }}</text>
          <text class="view-count">👁 {{ item.view_count || 0 }}</text>
        </view>
        
        <text class="knowledge-title">{{ item.title }}</text>
        
        <text class="knowledge-content">{{ truncateContent(item.content) }}</text>
        
        <view class="knowledge-footer">
          <text class="update-time">{{ formatDate(item.updated_at) }}</text>
          <text class="read-more">阅读全文 ></text>
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
      keyword: '',
      currentCategory: 'all',
      knowledgeList: [],
      categories: [
        { value: 'all', label: '全部' },
        { value: 'vaccine', label: '💉 疫苗' },
        { value: 'deworming', label: '💊 驱虫' },
        { value: 'diet', label: '🍖 饮食' },
        { value: 'disease', label: '🏥 疾病' },
        { value: 'behavior', label: '🐾 行为' },
        { value: 'breed', label: '🐶 品种' }
      ]
    };
  },
  
  onLoad() {
    this.loadKnowledge();
  },
  
  onPullDownRefresh() {
    this.loadKnowledge();
    uni.stopPullDownRefresh();
  },
  
  methods: {
    // 加载知识
    async loadKnowledge() {
      this.loading = true;
      try {
        const params = {};
        if (this.currentCategory !== 'all') {
          params.category = this.currentCategory;
        }
        if (this.keyword) {
          params.keyword = this.keyword;
        }
        
        const res = await api.getKnowledge(params);
        if (res.code === 200) {
          this.knowledgeList = res.data || [];
        }
      } catch (error) {
        console.error('Load knowledge error:', error);
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    
    // 切换分类
    onCategoryChange(category) {
      this.currentCategory = category;
      this.loadKnowledge();
    },
    
    // 搜索
    onSearch() {
      this.loadKnowledge();
    },
    
    // 获取分类标签
    getCategoryLabel(category) {
      const cat = this.categories.find(c => c.value === category);
      return cat ? cat.label : category;
    },
    
    // 截断内容
    truncateContent(content) {
      if (!content) return '';
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    },
    
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return '今天';
      if (days === 1) return '昨天';
      if (days < 7) return `${days}天前`;
      
      return date.toLocaleDateString('zh-CN');
    },
    
    // 查看详情
    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/knowledge-detail/knowledge-detail?id=${id}`
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

.search-bar {
  margin-bottom: 20rpx;
}

.category-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
  
  .category-list {
    display: inline-flex;
    gap: 15rpx;
    
    .category-item {
      display: inline-block;
      padding: 15rpx 30rpx;
      background-color: #FFF;
      border-radius: 20rpx;
      font-size: 26rpx;
      color: #666;
      
      &.active {
        background-color: #FF9500;
        color: #FFF;
      }
    }
  }
}

.knowledge-list {
  height: calc(100vh - 280rpx);
  
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
  
  .knowledge-card {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .knowledge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15rpx;
      
      .category-tag {
        font-size: 24rpx;
        color: #FF9500;
        background-color: #FFF5E6;
        padding: 6rpx 16rpx;
        border-radius: 12rpx;
      }
      
      .view-count {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .knowledge-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 15rpx;
      line-height: 1.4;
    }
    
    .knowledge-content {
      display: block;
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20rpx;
    }
    
    .knowledge-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      border-top: 1rpx solid #EEE;
      
      .update-time {
        font-size: 24rpx;
        color: #999;
      }
      
      .read-more {
        font-size: 24rpx;
        color: #FF9500;
      }
    }
  }
}
</style>
