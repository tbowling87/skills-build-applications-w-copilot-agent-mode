import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Environment-aware base URL for Codespaces
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OctoFit Tracker API is running' });
});

// Base API Info Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'OctoFit Tracker API',
    version: '1.0.0',
    baseUrl: baseUrl,
    endpoints: {
      health: '/api/health',
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`OctoFit Tracker API running on ${baseUrl}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
