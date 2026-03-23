/**
 * API 请求封装
 */

// 基础配置
const BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:3000/api/v1';

// 存储 Token
let token = '';

/**
 * 设置 Token
 */
export function setToken(newToken) {
  token = newToken;
  try {
    uni.setStorageSync('token', newToken);
  } catch (e) {
    console.warn('Storage not available');
  }
}

/**
 * 获取 Token
 */
export function getToken() {
  if (token) return token;
  try {
    token = uni.getStorageSync('token') || '';
  } catch (e) {
    token = '';
  }
  return token;
}

/**
 * 清除 Token
 */
export function clearToken() {
  token = '';
  try {
    uni.removeStorageSync('token');
  } catch (e) {
    console.warn('Storage not available');
  }
}

/**
 * 请求封装
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const currentToken = getToken();
    
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(currentToken && { 'Authorization': `Bearer ${currentToken}` }),
        ...options.header
      },
      timeout: options.timeout || 10000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token 过期，清除并跳转登录
          clearToken();
          uni.navigateTo({ url: '/pages/login/login' });
          reject(new Error('未授权，请重新登录'));
        } else {
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'));
      }
    });
  });
}

/**
 * API 方法集合
 */
export const api = {
  // ============ 认证相关 ============
  
  /**
   * 微信登录
   */
  login(code) {
    return request({
      url: '/auth/login',
      method: 'POST',
      data: { code }
    });
  },
  
  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    return request({
      url: '/auth/me',
      method: 'GET'
    });
  },
  
  /**
   * 更新用户信息
   */
  updateProfile(data) {
    return request({
      url: '/auth/profile',
      method: 'PUT',
      data
    });
  },
  
  // ============ 宠物相关 ============
  
  /**
   * 获取宠物列表
   */
  getPets() {
    return request({
      url: '/pets',
      method: 'GET'
    });
  },
  
  /**
   * 获取宠物详情
   */
  getPetById(id) {
    return request({
      url: `/pets/${id}`,
      method: 'GET'
    });
  },
  
  /**
   * 创建宠物
   */
  createPet(data) {
    return request({
      url: '/pets',
      method: 'POST',
      data
    });
  },
  
  /**
   * 更新宠物信息
   */
  updatePet(id, data) {
    return request({
      url: `/pets/${id}`,
      method: 'PUT',
      data
    });
  },
  
  /**
   * 删除宠物
   */
  deletePet(id) {
    return request({
      url: `/pets/${id}`,
      method: 'DELETE'
    });
  },
  
  /**
   * 设为默认宠物
   */
  setDefaultPet(id) {
    return request({
      url: `/pets/${id}/default`,
      method: 'PUT'
    });
  },
  
  // ============ 疫苗相关 ============
  
  /**
   * 获取疫苗记录列表
   */
  getVaccines(params) {
    return request({
      url: '/vaccines',
      method: 'GET',
      params
    });
  },
  
  /**
   * 获取疫苗记录详情
   */
  getVaccineById(id) {
    return request({
      url: `/vaccines/${id}`,
      method: 'GET'
    });
  },
  
  /**
   * 添加疫苗记录
   */
  createVaccine(data) {
    return request({
      url: '/vaccines',
      method: 'POST',
      data
    });
  },
  
  /**
   * 更新疫苗记录
   */
  updateVaccine(id, data) {
    return request({
      url: `/vaccines/${id}`,
      method: 'PUT',
      data
    });
  },
  
  /**
   * 删除疫苗记录
   */
  deleteVaccine(id) {
    return request({
      url: `/vaccines/${id}`,
      method: 'DELETE'
    });
  },
  
  /**
   * 获取即将到期的疫苗
   */
  getUpcomingVaccines(petId) {
    return request({
      url: `/vaccines/pet/${petId}/upcoming`,
      method: 'GET'
    });
  },
  
  // ============ 驱虫相关 ============
  
  /**
   * 获取驱虫记录列表
   */
  getDewormings(params) {
    return request({
      url: '/dewormings',
      method: 'GET',
      params
    });
  },
  
  /**
   * 获取驱虫记录详情
   */
  getDewormingById(id) {
    return request({
      url: `/dewormings/${id}`,
      method: 'GET'
    });
  },
  
  /**
   * 添加驱虫记录
   */
  createDeworming(data) {
    return request({
      url: '/dewormings',
      method: 'POST',
      data
    });
  },
  
  /**
   * 更新驱虫记录
   */
  updateDeworming(id, data) {
    return request({
      url: `/dewormings/${id}`,
      method: 'PUT',
      data
    });
  },
  
  /**
   * 删除驱虫记录
   */
  deleteDeworming(id) {
    return request({
      url: `/dewormings/${id}`,
      method: 'DELETE'
    });
  },
  
  /**
   * 获取即将到期的驱虫
   */
  getUpcomingDewormings(petId) {
    return request({
      url: `/dewormings/pet/${petId}/upcoming`,
      method: 'GET'
    });
  },
  
  // ============ 健康记录相关 ============
  
  /**
   * 获取健康记录列表
   */
  getHealthRecords(params) {
    return request({
      url: '/health',
      method: 'GET',
      params
    });
  },
  
  /**
   * 添加健康记录
   */
  createHealthRecord(data) {
    return request({
      url: '/health',
      method: 'POST',
      data
    });
  },
  
  /**
   * 获取体重趋势
   */
  getWeightTrend(petId) {
    return request({
      url: '/health/weight-trend',
      method: 'GET',
      params: { pet_id: petId }
    });
  },
  
  // ============ 知识库相关 ============
  
  /**
   * 获取知识库列表
   */
  getKnowledge(params) {
    return request({
      url: '/knowledge',
      method: 'GET',
      params
    });
  },
  
  /**
   * 获取知识库详情
   */
  getKnowledgeById(id) {
    return request({
      url: `/knowledge/${id}`,
      method: 'GET'
    });
  }
};

export default {
  setToken,
  getToken,
  clearToken,
  request,
  api
};
