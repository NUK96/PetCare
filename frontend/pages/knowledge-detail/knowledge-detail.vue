<template>
  <view class="container">
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    
    <view v-else-if="!article" class="empty">
      <text>文章不存在</text>
    </view>
    
    <view v-else class="article">
      <!-- 标题 -->
      <view class="article-header">
        <text class="category-tag">{{ getCategoryLabel(article.category) }}</text>
        <text class="title">{{ article.title }}</text>
      </view>
      
      <!-- 元信息 -->
      <view class="article-meta">
        <text class="meta-item">👁 {{ article.view_count || 0 }} 阅读</text>
        <text class="meta-item">📅 {{ formatDate(article.updated_at) }}</text>
      </view>
      
      <!-- 内容 -->
      <view class="article-content">
        <text class="content-text">{{ article.content }}</text>
      </view>
      
      <!-- 标签 -->
      <view v-if="article.tags && article.tags.length" class="tags-section">
        <text class="tags-label">相关标签：</text>
        <view class="tags-list">
          <text v-for="tag in article.tags" :key="tag" class="tag-item">{{ tag }}</text>
        </view>
      </view>
      
      <!-- 相关文章 -->
      <view class="related-section">
        <text class="section-title">相关文章</text>
        <view class="related-list">
          <view 
            v-for="item in relatedArticles" 
            :key="item.id"
            class="related-item"
            @click="viewDetail(item.id)"
          >
            <text class="related-title">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js';

export default {
  data() {
    return {
      loading: false,
      articleId: '',
      article: null,
      relatedArticles: []
    };
  },
  
  onLoad(options) {
    if (options.id) {
      this.articleId = options.id;
      this.loadArticle();
    }
  },
  
  methods: {
    // 加载文章
    async loadArticle() {
      this.loading = true;
      try {
        const res = await api.getKnowledgeById(this.articleId);
        if (res.code === 200) {
          this.article = res.data;
          this.loadRelated();
        }
      } catch (error) {
        console.error('Load article error:', error);
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载相关文章
    async loadRelated() {
      try {
        const res = await api.getKnowledge({
          category: this.article.category,
          limit: 5
        });
        if (res.code === 200 && res.data?.length) {
          this.relatedArticles = res.data.filter(item => item.id !== this.articleId).slice(0, 5);
        }
      } catch (error) {
        console.error('Load related error:', error);
      }
    },
    
    // 获取分类标签
    getCategoryLabel(category) {
      const categories = {
        vaccine: '💉 疫苗',
        deworming: '💊 驱虫',
        diet: '🍖 饮食',
        disease: '🏥 疾病',
        behavior: '🐾 行为',
        breed: '🐶 品种'
      };
      return categories[category] || category;
    },
    
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN');
    },
    
    // 查看详情
    viewDetail(id) {
      if (id === this.articleId) return;
      this.articleId = id;
      this.loadArticle();
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

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  font-size: 28rpx;
  color: #999;
}

.article {
  .article-header {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .category-tag {
      display: inline-block;
      font-size: 24rpx;
      color: #FF9500;
      background-color: #FFF5E6;
      padding: 8rpx 20rpx;
      border-radius: 12rpx;
      margin-bottom: 15rpx;
    }
    
    .title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      line-height: 1.4;
    }
  }
  
  .article-meta {
    display: flex;
    gap: 30rpx;
    padding: 20rpx 30rpx;
    background-color: #FFF;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    
    .meta-item {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .article-content {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .content-text {
      font-size: 30rpx;
      color: #333;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
  
  .tags-section {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .tags-label {
      font-size: 26rpx;
      color: #666;
      display: block;
      margin-bottom: 15rpx;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 15rpx;
      
      .tag-item {
        font-size: 24rpx;
        color: #666;
        background-color: #F8F8F8;
        padding: 10rpx 20rpx;
        border-radius: 20rpx;
      }
    }
  }
  
  .related-section {
    background-color: #FFF;
    border-radius: 12rpx;
    padding: 30rpx;
    
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .related-list {
      .related-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #EEE;
        
        &:last-child {
          border-bottom: none;
        }
        
        .related-title {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
