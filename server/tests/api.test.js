const request = require('supertest');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.status(200).json({ status: 'OK' }));

describe('CI/CD Provera - API Testovi', () => {
  it('Treba da vrati status 200 za osnovnu rutu', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('OK');
  });
});