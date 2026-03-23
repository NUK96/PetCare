/**
 * PetCare API 测试用例
 */

const request = require('supertest');
const app = require('../src/app');

describe('PetCare API Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('service', 'PetCare Backend');
    });
  });

  describe('GET /api/v1/knowledge', () => {
    it('should return knowledge list', async () => {
      const res = await request(app).get('/api/v1/knowledge');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('code');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should handle login request', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ code: 'test_code' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('code');
    });
  });

  describe('API Security', () => {
    it('should reject unauthorized pet access', async () => {
      const res = await request(app).get('/api/v1/pets');
      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject unauthorized vaccine access', async () => {
      const res = await request(app).get('/api/v1/vaccines');
      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject unauthorized health record access', async () => {
      const res = await request(app).get('/api/v1/health');
      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid pet data', async () => {
      const res = await request(app)
        .post('/api/v1/pets')
        .send({ name: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
