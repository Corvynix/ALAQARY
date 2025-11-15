import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import healthRouter from '../../server/routes/health';

const app = express();
app.use(express.json());
app.use('/', healthRouter);

describe('Health Check API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
  });

  it('should return readiness status', async () => {
    const response = await request(app).get('/ready');
    
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('status');
  });

  it('should return liveness status', async () => {
    const response = await request(app).get('/live');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'alive' });
  });
});

