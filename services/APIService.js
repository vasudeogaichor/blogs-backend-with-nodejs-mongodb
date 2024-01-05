// AppServices.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('express-async-errors');

const { postRouter, authRouter } = require('../routes');
const { verifyToken } = require('../middleware/authMiddleware');

class AppServices {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3002;
  }

  async initialize() {
    this.setupMiddlewares();
    await this.connectDatabase();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  async connectDatabase() {
    try {
      await mongoose.connect('mongodb://localhost:27017/db_auth');
      console.log('Database connected Successfully');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      // Handle error
      process.exit(1);
    }
  }

  setupRoutes() {
    this.app.use('/auth', authRouter);
    this.app.use(verifyToken);
    this.app.use('/posts', postRouter);
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      const stackTrace = err.stack.split('\n');
      res.status(500).json({ Error: stackTrace });
    });
  }

  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running at http://localhost:${this.PORT}`);
    });
  }
}

module.exports = AppServices;
