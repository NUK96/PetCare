<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化全局数据
    uni.$u.http.setConfig({
      baseUrl: '/api/v1',
      loading: true,
      loadingText: '加载中...'
    })
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共 css*/
@import 'uview-ui/index.scss';

page {
  background-color: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 通用样式 */
.container {
  padding: 20rpx;
}

.section {
  background-color: #FFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.btn-primary {
  background-color: #FF9500;
  color: #FFF;
  border-radius: 12rpx;
  padding: 25rpx 50rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
